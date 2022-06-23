import * as IpfsHttpClient from "ipfs-http-client";
import * as ipns from "ipns";
import * as IPFS from "ipfs-core";
import pRetry from "p-retry";
import last from "it-last";
import { toString as uint8ArrayToString } from 'uint8arrays/to-string'
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
import { base36 } from 'multiformats/bases/base36'
import { CID } from 'multiformats/cid'
import * as Digest from 'multiformats/hashes/digest'
import { WebSockets } from '@libp2p/websockets'
import * as filters from '@libp2p/websockets/filters'
import { Logger, onEnterPress, catchAndLog } from "./util";

async function main() {
  const apiUrlInput = document.getElementById("api-url");
  const nodeConnectBtn = document.getElementById("node-connect");

  const peerAddrInput = document.getElementById("peer-addr");
  const wsConnectBtn = document.getElementById("peer-connect");

  const ipnsInput = document.getElementById("topic");
  const publishBtn = document.getElementById("publish");

  const namespace = "/record/";
  const retryOptions = {
    retries: 5,
  };

  let log = Logger(document.getElementById("console"));
  let sLog = Logger(document.getElementById("server-console"));
  let keyName = "self";

  let ipfsAPI; // remote server IPFS node
  let ipfsBrowser; // local browser IPFS node
  let peerId;

  // init local browser node right away
  log(`Browser IPFS getting ready...`);
  ipfsBrowser = await IPFS.create({
    pass: "01234567890123456789",
    EXPERIMENTAL: { ipnsPubsub: true },
    libp2p: {
      transports: [
        // This is added for local demo!
        // In a production environment the default filter should be used
        // where only DNS + WSS addresses will be dialed by websockets in the browser.
        new WebSockets({
          filter: filters.all
        })
      ]
    }
  });
  const { id } = await ipfsBrowser.id();
  log(`Browser IPFS ready! Node id: ${id}`);
  document.getElementById("api-url").disabled = false;
  document.getElementById("node-connect").disabled = false;

  async function nodeConnect(url) {
    log(`Connecting to ${url}`);
    ipfsAPI = IpfsHttpClient.create(url);
    const { id, agentVersion } = await ipfsAPI.id();
    peerId = id;
    log(`<span class="green">Success!</span>`);
    log(`Version ${agentVersion}`);
    log(`Peer ID ${id}`);
    document.getElementById("peer-addr").disabled = false;
    document.getElementById("peer-connect").disabled = false;
  }

  async function wsConnect(addr) {
    if (!addr) {
      throw new Error("Missing peer multiaddr");
    }
    if (!ipfsBrowser) {
      throw new Error("Wait for the local IPFS node to start first");
    }
    log(`Connecting to peer ${addr}`);
    await ipfsBrowser.swarm.connect(addr);
    log(`<span class="green">Success!</span>`);
    log("Listing swarm peers...");

    const peers = await pRetry(async () => {
      const peers = await ipfsBrowser.swarm.peers();

      if (peers.find(peer => addr.endsWith(peer.peer))) {
        return peers
      }

      throw new Error('Could not find go-ipfs peer in swarm peers')
    })
      .catch(err => {
        sLog(`<span class="red">[Fail] ${err.message}</span>`);
      })

    peers.forEach((peer) => {
      //console.log(`peer: ${JSON.stringify(peer, null, 2)}`);
      const fullAddr = `${peer.addr}/ipfs/${peer.peer}`;
      log(`<span class="${
          addr.endsWith(peer.peer) ? "teal" : ""
        }">${fullAddr}</span>`);
    });
    log(`(${peers.length} peers total)`);
    document.getElementById("topic").disabled = false;
    document.getElementById("publish").disabled = false;
  }

  // Wait until a peer subscribes a topic
  const waitForPeerToSubscribe = async (daemon, topic) => {
    await pRetry(async () => {
      const res = await daemon.pubsub.ls();

      if (!res || !res.length || !res.includes(topic)) {
        throw new Error("Could not find subscription");
      }

      return res[0];
    }, retryOptions);
  };

  // wait until a peer know about other peer to subscribe a topic
  const waitForNotificationOfSubscription = (daemon, topic, peerId) =>
    pRetry(async () => {
      const res = await daemon.pubsub.peers(topic);

      if (!res || !res.length || !res.includes(peerId)) {
        throw new Error("Could not find peer subscribing");
      }
    }, retryOptions);

  async function subs(node, topic, tLog) {
    tLog(`Subscribing to ${topic}`);
    await node.pubsub.subscribe(
      topic,
      (msg) => {
        const from = msg.from;
        const seqno = uint8ArrayToString(msg.seqno, "hex");

        tLog(
          `${new Date(
            Date.now()
          ).toLocaleTimeString()}\n Message ${seqno} from ${from}`
        );

        let regex = "/record/";
        if (topic.match(regex) ? topic.match(regex).length > 0 : false) {
          tLog(`\n#${ipns.unmarshal(msg.data).sequence.toString()} Topic: ${msg.topicIDs[0].toString()}`);
          tLog(`Value:\n${uint8ArrayToString(ipns.unmarshal(msg.data).value, 'hex')}`);
        } else {
          try {
            tLog(JSON.stringify(msg.data.toString(), null, 2));
          } catch (_) {
            tLog(uint8ArrayToString(msg.data, "hex"));
          }
        }
      }
    );
  }

  async function createKey(keyName) {
    return new Promise(async (resolve, reject) => {
      try {
        // generate a key on the browser IPNS keychain with the specified name
        await ipfsAPI.key.gen(keyName, {
          type: 'ed25519'
        })

        // now this key can be used to publish to this ipns publicKey
        resolve(true);
      } catch (err) {
        console.log(`Error creating Key ${keyName}: \n ${err}`);
        reject(false);
      }
    });
  }

  async function publish(content) {
    if (!content) {
      throw new Error("Missing ipns content to publish");
    }

    if (!content.startsWith('/ipfs/')) {
      throw new Error("Content should start with /ipfs/");
    }

    if (!ipfsAPI) {
      throw new Error("Connect to a go-server node first");
    }

    if (!ipfsAPI.name.pubsub.state() || !ipfsBrowser.name.pubsub.state()) {
      throw new Error(
        "IPNS Pubsub must be enabled on bother peers, use --enable-namesys-pubsub"
      );
    }

    log(`Publish to IPNS`); // subscribes the server to our IPNS topic

    let browserNode = await ipfsBrowser.id();
    let serverNode = await ipfsAPI.id();

    // get which key this will be publish under, self or an imported custom key
    keyName = document.querySelector('input[name="keyName"]:checked').value;
    let keys = { name: "self", id: browserNode.id }; // default init

    if (keyName != "self") {
      if (!(await ipfsBrowser.key.list()).find((k) => k.name == keyName)) {
        // skip if custom key exists already
        await createKey(keyName);
      }

      let r = await ipfsBrowser.key.list();
      keys = r.find((k) => k.name == keyName);
      log(JSON.stringify(keys));
    }

    log(`Initial Resolve ${keys.id}`); // subscribes the server to our IPNS topic
    last(ipfsAPI.name.resolve(keys.id, { stream: false })); // save the pubsub topic to the server to make them listen

    // set up the topic from ipns key
    const ipnsKeys = ipns.peerIdToRoutingKey(browserNode.id);
    const topic = `${namespace}${uint8ArrayToString(ipnsKeys.routingKey.uint8Array(), 'base64url')}`;

    // subscribe and log on both nodes
    await subs(ipfsBrowser, topic, log); // browserLog
    await subs(ipfsAPI, topic, sLog); // serverLog

    // confirm they are subscribed
    await waitForPeerToSubscribe(ipfsAPI, topic); // confirm topic is on THEIR list  // API
    await waitForNotificationOfSubscription(ipfsBrowser, topic, serverNode.id); // confirm they are on OUR list

    let remList = await ipfsAPI.pubsub.ls(); // API
    if (!remList.includes(topic)) {
      sLog(`<span class="red">[Fail] !Pubsub.ls ${topic}</span>`);
    } else {
      sLog(`[Pass] Pubsub.ls`);
    }

    const multihash = uint8ArrayFromString(keys.id, 'base58btc')
    const digest = Digest.decode(multihash)
    const libp2pKey = CID.createV1(0x72, digest)
    const ipnsName = `/ipns/${libp2pKey.toString(base36)}`

    await pRetry(async () => {
      let remListSubs = await ipfsAPI.name.pubsub.subs(); // API

      if (!remListSubs.includes(ipnsName)) {
        throw new Error(`!Name.Pubsub.subs ${ipnsName}`)
      } else {
        sLog(`[Pass] Name.Pubsub.subs`);
      }
    })
      .catch(err => {
        sLog(`<span class="red">[Fail] ${err.message}</span>`);
      })

    // publish will send a pubsub msg to the server to update their ipns record
    log(`Publishing ${content} to ${keyName} ${ipnsName}`);
    const results = await ipfsBrowser.name.publish(content, {
      resolve: false,
      key: keyName,
    });
    log(`Published ${results.name} to ${results.value}`); //

    log(`Try resolve ${keys.id} on server through API`);

    let name = await last(
      ipfsAPI.name.resolve(keys.id, {
        stream: false,
      })
    );
    log(`Resolved: ${name}`);
    if (name == content) {
      log(`<span class="green">IPNS Publish Success!</span>`);
      log(`<span class="green">Look at that! ${keys.id} resolves to ${content}</span>`);
    } else {
      log(`<span class="red">Error, resolve did not match ${name} !== ${content}</span>`);
    }
  }

  const onNodeConnectClick = catchAndLog(
    () => nodeConnect(apiUrlInput.value),
    log
  );

  apiUrlInput.addEventListener("keydown", onEnterPress(onNodeConnectClick));
  nodeConnectBtn.addEventListener("click", onNodeConnectClick);

  const onwsConnectClick = catchAndLog(
    () => wsConnect(peerAddrInput.value),
    log
  );
  peerAddrInput.addEventListener("keydown", onEnterPress(onwsConnectClick));
  wsConnectBtn.addEventListener("click", onwsConnectClick);

  const onPublishClick = catchAndLog(() => publish(ipnsInput.value), log);
  ipnsInput.addEventListener("keydown", onEnterPress(onPublishClick));
  publishBtn.addEventListener("click", onPublishClick);
}

main();
