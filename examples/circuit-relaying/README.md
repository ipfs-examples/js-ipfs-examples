<p align="center">
  <a href="https://js.ipfs.io" title="JS IPFS">
    <img src="https://ipfs.io/ipfs/Qme6KJdKcp85TYbLxuLV7oQzMiLremD7HMoXLZEmgo6Rnh/js-ipfs-sticker.png" alt="IPFS in JavaScript logo" width="244" />
  </a>
</p>

<h3 align="center"><b>IPFS Circuit Relay</b></h3>

<p align="center">
    <b><i>Circuit relay, where it fits in the stack and how to use it.!</i></b>
    <br />
    <br />
    <img src="https://raw.githubusercontent.com/jlord/forkngo/gh-pages/badges/cobalt.png" width="200">
    <br>
    <a href="https://github.com/ipfs/js-ipfs/tree/master/docs">Explore the docs</a>
    ·
    <a href="https://codesandbox.io/">View Demo</a>
    ·
    <a href="https://github.com/ipfs-examples/js-ipfs-examples/issues">Report Bug</a>
    ·
    <a href="https://github.com/ipfs-examples/js-ipfs-examples/issues">Request Feature/Example</a>
  </p>

## Table of Contents

- [Table of Contents](#table-of-contents)
- [About The Project](#about-the-project)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation and Running example](#installation-and-running-example)
- [Usage](#usage)
  - [So what is a `circuit-relay` and what do we need it for?](#so-what-is-a-circuit-relay-and-what-do-we-need-it-for)
    - [How does circuit relay work?](#how-does-circuit-relay-work)
    - [What's up with this `HOP` and `STOP`?](#whats-up-with-this-hop-and-stop)
    - [A few caveats (and features)](#a-few-caveats-and-features)
    - [A word on circuit relay addresses](#a-word-on-circuit-relay-addresses)
  - [Step-by-Step example](#step-by-step-example)
  - [1. Configure and run the js or go ipfs node](#1-configure-and-run-the-js-or-go-ipfs-node)
    - [Setting up a `go-ipfs` node](#setting-up-a-go-ipfs-node)
    - [Setting up a `js-ipfs` node](#setting-up-a-js-ipfs-node)
    - [Starting the relay node](#starting-the-relay-node)
  - [2. Configure and run the bundled example](#2-configure-and-run-the-bundled-example)
    - [3. Connect the two browser nodes to the circuit relay](#3-connect-the-two-browser-nodes-to-the-circuit-relay)
  - [4. Dial the two browser nodes using a `/p2p-circuit` address](#4-dial-the-two-browser-nodes-using-a-p2p-circuit-address)
  - [5. Send data browser to browser.](#5-send-data-browser-to-browser)
  - [So what just happened?](#so-what-just-happened)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [Want to hack on IPFS?](#want-to-hack-on-ipfs)

## About The Project

- Read the [docs](https://github.com/ipfs/js-ipfs/tree/master/docs)
- Look into other [examples](https://github.com/ipfs/js-ipfs/tree/master/examples) to learn how to spawn an IPFS node in Node.js and in the Browser
- Consult the [Core API docs](https://github.com/ipfs/js-ipfs/tree/master/docs/core-api) to see what you can do with an IPFS node
- Visit https://dweb-primer.ipfs.io to learn about IPFS and the concepts that underpin it
- Head over to https://proto.school to take interactive tutorials that cover core IPFS APIs
- Check out https://docs.ipfs.io for tips, how-tos and more
- See https://blog.ipfs.io for news and more
- Need help? Please ask 'How do I?' questions on https://discuss.ipfs.io

## Getting Started

### Prerequisites

Make sure you have installed all of the following prerequisites on your development machine:

- Git - [Download & Install Git](https://git-scm.com/downloads). OSX and Linux machines typically have this already installed.
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.
- IPFS Daemon - [Install js-ipfs](https://github.com/ipfs/js-ipfs) or [Download & Install IPFS Desktop](https://docs.ipfs.io/install/ipfs-desktop/) that will run the go version of IPFS or head over to https://dist.ipfs.io/#go-ipfs and hit the "Download go-ipfs" button. Extract the archive and read the instructions to install.

### Installation and Running example

```console
> npm install
> npm start
```

Now open your browser at `http://localhost:8888`

## Usage

### So what is a `circuit-relay` and what do we need it for?

In p2p networks there are many cases where two nodes can't talk to each other directly. That may happen because of network topology, i.e. NATs, or execution environments - for example browser nodes can't connect to each other directly because they lack any sort of socket functionality and relaying on specialized rendezvous nodes introduces an undesirable centralization point to the network. A `circuit-relay` is a way to solve this problem - it is a node that allows two other nodes that can't otherwise talk to each other, use a third node, a relay to do so.

#### How does circuit relay work?

Here is a simple diagram depicting how a typical circuit-relay connection might look:

```
+---------------------+         |          |         +---------------------+
|       Node A        |---------> FIREWALL <---------|        Node B       |
+----------^----------+         |          |         +----------^----------+
           |                                                    |
           |               +---------------------+              |
           +--------------->   Circuit Relay     <--------------+
                           +---------------------+
```

`Node A` tries to connect to `Node B` but, UH-OH! There is a firewall in between that's preventing it from happening. If both `Node A` and `Node B` know about a relay, they can use it to establish the connection.

This is what it looks like, in simplified steps:

1. `Node A` tries to connect to `Node B` over one of its known addresses
2. Connection fails because of firewall/NAT/incompatible transports/etc...
3. Both `Node A` and `Node B` know of the same relay - `Relay`
4. `Node A` falls back to dialing over `Relay` to `Node B` using its `'/p2p-circuit'` address, which involves:
   1. `Node A` sends a `HOP` request to `Relay`
   2. `Relay` extracts the destination address, figures out that a circuit to `Node B` is being requested
   3. `Relay` sends a `STOP` request to `Node B`
   4. `Node B` responds with a `SUCCESS` message
   5. `Relay` proceed to create a circuit over the two nodes
5. `Node A` and `Node B` are now connected over `Relay`

That's it!

> For a more in-depth explanation take a look at the [relay spec](https://github.com/libp2p/specs/blob/master/relay/README.md) and `js-libp2p-circuit` [README](https://github.com/libp2p/js-libp2p-circuit/blob/master/README.md)

#### What's up with this `HOP` and `STOP`?

Circuit relay consists of two logical parts — dialer/listener and relay (`HOP`). The listener is also known as the `STOP` node. Each of these — dial, listen, and relay — happen on a different node. If we use the nodes from the above example, it looks something like this:

- The `dialer` knows how to dial a `relay` (`HOP`) - `Node A`
- The `relay` (`HOP`) knows how to contact a destination node (`STOP`) and create a circuit - `Relay` node
- The `listener` (`STOP`) knows how to process relay requests that come from the relay (`HOP`) node - `Node B`

_Fun fact - the `HOP` and `STOP` names are also used internally by circuit to identify the network message types._

#### A few caveats (and features)

There are a couple of caveats and features to be aware of:

- A `Relay` will only work if it already has a connection to the `STOP` node
- No `multihop` dialing is supported. It's a feature planed for upcoming releases (no date on this one)
  - `multihop` dialing is when several relays are used to establish the connection
- It is possible to use explicit relay addresses to connect to a node, or even to listen for connections on. See next section to learn how to do this.

#### A word on circuit relay addresses

A circuit relay address is a [multiaddress](https://multiformats.io/multiaddr/) that describes how to either connect to a peer over a relay (or relays), or allow a peer to announce it is reachable over a particular relay or any relay it is already connected to.

Circuit relay addresses are very flexible and can describe many different aspects of how to establish the relayed connection. In its simplest form, it looks something like this:

- `/p2p-circuit/p2p/QmPeer`

If we want to be specific as to which transport we want to use to establish the relay, we can encode that in the address as well:

- `/ip4/127.0.0.1/tcp/65000/p2p/QmRelay/p2p-circuit/p2p/QmPeer`

This tells us that we want to use `QmRelay` located at address 127.0.0.1 and port 65000.

- `/ip4/127.0.0.1/tcp/65000/p2p/QmRelay/p2p-circuit/ip4/127.0.0.1/tcp/8080/ws/p2p/QmPeer`

We can take it a step further and encode the same information for the destination peer. In this case, we have it located at 127.0.0.1 on port 8080 and using a Web sockets transport!

- `/ip4/127.0.0.1/tcp/65000/p2p/QmRelay/p2p-circuit`

If a node is configured with this address, it will use the specified host (`/ip4/127.0.0.1/tcp/65000/p2p/QmRelay`) as a relay and it will be reachable over this relay.

- There could multiple addresses of this sort specified in the config, in which case the node will be reachable over all of them.
- This is useful if, for example, the node is behind a firewall but wants to be reachable from the outside over a specific relay.

Other use-cases are also supported by this scheme, e.g. we can have multiple hops (circuit-relay nodes) encoded in the address, something planed for future releases.

### Step-by-Step example

Here's what we are going to be doing, today:

1. Install and configure `go-ipfs` and `js-ipfs` nodes
2. Configure and run the js or go ipfs node
3. Configure and run the bundled example
4. Connect the two browser nodes to the circuit relay
5. Dial the two browser nodes using a `/p2p-circuit` address
6. Finally, send data from one browser using the bundled example!

> We should end up with something similar to the bellow screenshot after we've gone through all the steps:

![](./img/img7.png)

### 1. Configure and run the js or go ipfs node

You can use a `go-ipfs` or a `js-ipfs` node as a relay. We'll demonstrate how to set both up in this tutorial and we encourage you to try both out. That said, either js or go should do the trick!

##### Setting up a `go-ipfs` node

In order to enable the relay functionality in `go-ipfs` we need to edit it's configuration file, located under `~/.ipfs/config`:

```json
  "Swarm": {
    "AddrFilters": null,
    "ConnMgr": {
      "GracePeriod": "20s",
      "HighWater": 900,
      "LowWater": 600,
      "Type": "basic"
    },
    "DisableBandwidthMetrics": false,
    "DisableNatPortMap": false,
    "DisableRelay": false,
    "EnableRelayHop": true
  }
```

The two options we're looking for are `DisableRelay` and `EnableRelayHop`. We want the former (`DisableRelay`) set to `false` and the latter (`EnableRelayHop`) to `true`, just like in the example above. That should set our go node as a relay.

We also need to make sure our go node can be dialed from the browser. For that, we need to enable a transport that both the browser and the go node can communicate over. We will use the web sockets transport, although there are others that can be used, such as `webrtc-star` and `websocket-star`. To enable the transport and set the interface and port we need to edit the `~/.ipfs/config` one more time. Let's find the `Swarm` array and add our desired address there. I picked `/ip4/0.0.0.0/tcp/4004/ws` because it is a port I know is not being used by anything on my machine, but we can also use port `0` so that the OS chooses a random available port for us — either one should work.

```json
  "Swarm": [
    "/ip4/0.0.0.0/tcp/4001",
    "/ip4/0.0.0.0/tcp/4004/ws",
    "/ip6/::/tcp/4001"
  ],
```

The config should look similar to the above snippet after we've edited it.

##### Setting up a `js-ipfs` node

We need to go through similar steps to enable circuit relay in `jsipfs`. However, the config options are slightly different — that should change once this feature is not marked as experimental, but for now we have to deal with two different sets of options.

Just as we did with `go-ipfs`, go ahead and edit `js-ipfs` config file located under `~/.jsipfs/config`. Let's add the following config:

```js
  "relay": {
    "enabled": true,
    "hop": {
      "enabled": true
    }
  }
```

Note that we don't have to do anything to enable the `websocket` transport as it is enabled by default in `jsipfs`.

##### Starting the relay node

We can start the relay nodes by either running `ipfs daemon` or `jsipfs daemon`:

**go ipfs**

```console
$ ipfs daemon
Initializing daemon...
Swarm listening on /ip4/127.0.0.1/tcp/4001
Swarm listening on /ip4/192.168.1.132/tcp/4001
Swarm listening on /ip6/::1/tcp/4001
Swarm listening on /p2p-circuit/p2p/QmY73BLYav2gYc9PCEnjQqbfSGiqFv3aMsRXNyKFGtUoGF
Swarm announcing /ip4/127.0.0.1/tcp/4001
Swarm announcing /ip4/186.4.18.182/tcp/58986
Swarm announcing /ip4/192.168.1.132/tcp/4001
Swarm announcing /ip6/::1/tcp/4001
API server listening on /ip4/127.0.0.1/tcp/5001
Gateway (readonly) server listening on /ip4/127.0.0.1/tcp/8080
Daemon is ready
```

In the case of go ipfs, the crucial `/p2p/Qm...` part of the multiaddr might be missing. In that case, you can get it by running the `ipfs id` command.

```console
$ ipfs id
{
        "ID": "QmY73BLYav2gYc9PCEnjQqbfSGiqFv3aMsRXNyKFGtUoGF",
        "PublicKey": "CAASpgIwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQC84qPFzqajCfnvaJunqt48S1LIBRthXV60q5QClL+dUfOOU/m7v1ZcpNhvFFUN6tVCDaoT5AxEv0czxZiVx/njl6FVIc6tE1J+HWpc8cbAXNY6QbbyzKl/rjp7V8/QClE0JqgjIk84wnWGTwFhOEt0hnpu2XFt9iHaenSfg3EAa8K9MlbxmbawuxNLJJf7VZXkJrUNl6WOglAVU8Sqc4QaahCLVK5Dzo98zDBq1KDBxMbUgH0LTqzr6i+saxkEHZmBKO+mMVT3LzOUx1DQR4pLAw1qgoJstsIZEaJ2XLh975IiI7OKqWYH7+3NyNK2sldJK/4Zko4rH3irmnkAxLcFAgMBAAE=",
        "Addresses": [
                "/ip4/127.0.0.1/tcp/4001/p2p/QmY73BLYav2gYc9PCEnjQqbfSGiqFv3aMsRXNyKFGtUoGF",
                "/ip4/192.168.1.132/tcp/4001/p2p/QmY73BLYav2gYc9PCEnjQqbfSGiqFv3aMsRXNyKFGtUoGF",
                "/ip6/::1/tcp/4001/p2p/QmY73BLYav2gYc9PCEnjQqbfSGiqFv3aMsRXNyKFGtUoGF",
                "/ip4/186.4.18.182/tcp/13285/p2p/QmY73BLYav2gYc9PCEnjQqbfSGiqFv3aMsRXNyKFGtUoGF",
                "/ip4/186.4.18.182/tcp/13285/p2p/QmY73BLYav2gYc9PCEnjQqbfSGiqFv3aMsRXNyKFGtUoGF"
        ],
        "AgentVersion": "go-ipfs/0.4.14-dev/cb5bb7dd8",
        "ProtocolVersion": "ipfs/0.1.0"
}
```

We can then grab the resolved multiaddr from the `Addresses` array — `/ip4/127.0.0.1/tcp/4004/ws/p2p/Qm...`. Let's note it down somewhere and move to the next step.

**js ipfs**

```console
$ jsipfs daemon
Initializing daemon...
Swarm listening on /p2p-circuit/p2p/QmfQj8YwDdy1uP2DpZBa7k38rSGPvhHiC52cdAGWBqoVpq
Swarm listening on /p2p-circuit/ip4/0.0.0.0/tcp/4002/p2p/QmfQj8YwDdy1uP2DpZBa7k38rSGPvhHiC52cdAGWBqoVpq
Swarm listening on /p2p-circuit/ip4/127.0.0.1/tcp/4003/ws/p2p/QmfQj8YwDdy1uP2DpZBa7k38rSGPvhHiC52cdAGWBqoVpq
Swarm listening on /ip4/127.0.0.1/tcp/4003/ws/p2p/QmfQj8YwDdy1uP2DpZBa7k38rSGPvhHiC52cdAGWBqoVpq
Swarm listening on /ip4/127.0.0.1/tcp/4002/p2p/QmfQj8YwDdy1uP2DpZBa7k38rSGPvhHiC52cdAGWBqoVpq
Swarm listening on /ip4/192.168.1.132/tcp/4002/p2p/QmfQj8YwDdy1uP2DpZBa7k38rSGPvhHiC52cdAGWBqoVpq
API is listening on: /ip4/127.0.0.1/tcp/5002
Gateway (readonly) is listening on: /ip4/127.0.0.1/tcp/9090
Daemon is ready
```

Look out for an address similar to `/ip4/127.0.0.1/tcp/4003/ws/p2p/Qm...`. Note it down somewhere, and let's move on to the next step.

### 2. Configure and run the bundled example

Now that we have ipfs installed and initialized, let's set up the included example. This is a standard npm package, so the usual `npm install` should get us going. Let's `cd` into the `examples/circuit-relaying` directory.

We should be able to run the project with `npm start` and get output similar to:

```sh
npm start
Server running at http://localhost:8888
```

The bundled example is a simple chat app that uses another cool ipfs feature - [pubsub](https://github.com/libp2p/specs/tree/master/pubsub). Let's open up a browser and paste the above url into the address bar. We should see something similar to the following image:

![](./img/img1.png)

#### 3. Connect the two browser nodes to the circuit relay

In order for our browser nodes to be able to messages each other, we need to get them connected. But to do that, we need to use a relay - browser nodes can't be connected directly because of lack of socket support.

Remember the caveat above `Currently a Relay will only work if it already has a connection to the STOP node`? This means that we need to connect our browser nodes to the relay node first.

Having both browsers running side by side (as shown in the first screenshot), enter the `/ip4/127.0.0.1/tcp/4003/ws/p2p/...` address noted above into the `Connect to Peer` field and hit the `Connect` button:

![](./img/img3.png)

After connecting to the IPFS node, we should see the relay peer show up under the `Swarm Peers` box.

![](./img/img4.png)

Let's repeat the same steps with the second tab. Now, both of our browser nodes should be connected to the relay and we can move on to the next step.

### 4. Dial the two browser nodes using a `/p2p-circuit` address

Now that our browsers are both connected to the relay peer, let's get them connected to each other. Create the p2p circuit address as follows:

```
${RELAY_ADDR}/p2p-circuit/p2p/${PEER_ID}
```

Here `${RELAY_ADDR}` is the multiaddr of the circuit relay node that you pasted into the "Connect to Peer" box in step 3, and `${PEER_ID}` is the id of the node we wish to connect to which can be found in the "Peer id" box of the browser window.

Use the id from the "Peer id" box in the second browser window in the relay address you paste into the first browser, then repeat this step using the relay address of the first window in the second.

![](./img/img5.png)

Let's hit the `Connect` button on each of the tabs and we should get the two browsers connected and join the chat room.

![](./img/img6.png)

### 5. Send data browser to browser.

Now that we have the two browsers connected, let's try the app out. Type a few words in one of the browser windows and you should see them appear in the other as well!

![](./img/img7.png)

Thats it!

### So what just happened?

Good question!

- We used [js-ipfs](htpps://github.com/ipfs/js-ipfs) running in the browser with circuit relay enabled:
  - _Notice the `relay.enabled` below_

you can find it in [src/app.js](src/app.js)

```js
const ipfs = await IPFS.create({
  repo: repo(),
  relay: {
    enabled: true,
    hop: {
      enabled: true,
    },
  },
  config: {
    Bootstrap: [],
  },
});
```

- We connected the browser nodes to an external node over its websocket transport using the `/ip4/127.0.0.1/tcp/4003/ws/p2p/...` multiaddr. That external node happens to be a `HOP` node, meaning that it can relay connections for our browsers (and other nodes) allowing them to connect

- And finally we connected the two browser nodes using the `/p2p-circuit/p2p/...` multiaddr. Take a look at the code below in [src/app.js](src/app.js#L103...L108) - lines 103-108

```js
try {
  await ipfs.swarm.connect(peer);
} catch (err) {
  return console.error(err);
}
$pAddrs.innerHTML += `<li>${peer.trim()}</li>`;
```

The above code snippet handles connecting to other nodes using `ipfs.swarm.connect`. Notice how there wasn't anything special we had to do to use the circuit once we had everything connected; all the magic is in the multiaddr! [Multiaddrs](https://multiformats.io/multiaddr/) are **AWESOME**!

I encourage the reader to take a look at the bundled app code to see how the browser nodes get setup, suffice to say nothing changes from the perspective of using an `IPFS` node in js code, apart from the new `EXPERIMENTAL` options.

Finally, a side note on [pubsub](https://github.com/libp2p/specs/blob/master/pubsub/README.md). We've used the amazing [ipfs-pubsub-room](https://github.com/ipfs-shipyard/ipfs-pubsub-room) module, to enable the chat functionality. Make sure to take a look at the demo [video](https://www.youtube.com/watch?v=Nv_Teb--1zg) that explains how pubsub works and how it can be used to build other applications!

Cheers!

_For more examples, please refer to the [Documentation](#documentation)_

## Documentation

- [Config](https://docs.ipfs.io/)
- [Core API](https://github.com/ipfs/js-ipfs/tree/master/docs/core-api)
- [Examples](https://github.com/ipfs/js-ipfs/tree/master/examples)
- [Development](https://github.com/ipfs/js-ipfs/blob/master/docs/DEVELOPMENT.md)
- [Tutorials](https://proto.school)

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the IPFS Project
2. Create your Feature Branch (`git checkout -b feature/amazing-feature`)
3. Commit your Changes (`git commit -a -m 'feat: add some amazing feature'`)
4. Push to the Branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Want to hack on IPFS?

[![](https://cdn.rawgit.com/jbenet/contribute-ipfs-gif/master/img/contribute.gif)](https://github.com/ipfs/community/blob/master/CONTRIBUTING.md)

The IPFS implementation in JavaScript needs your help! There are a few things you can do right now to help out:

Read the [Code of Conduct](https://github.com/ipfs/community/blob/master/code-of-conduct.md) and [JavaScript Contributing Guidelines](https://github.com/ipfs/community/blob/master/CONTRIBUTING_JS.md).

- **Check out existing issues** The [issue list](https://github.com/ipfs/js-ipfs/issues) has many that are marked as ['help wanted'](https://github.com/ipfs/js-ipfs/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc+label%3A%22help+wanted%22) or ['difficulty:easy'](https://github.com/ipfs/js-ipfs/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc+label%3Adifficulty%3Aeasy) which make great starting points for development, many of which can be tackled with no prior IPFS knowledge
- **Look at the [IPFS Roadmap](https://github.com/ipfs/roadmap)** This are the high priority items being worked on right now
- **Perform code reviews** More eyes will help
  a. speed the project along
  b. ensure quality, and
  c. reduce possible future bugs.
- **Add tests**. There can never be enough tests.
- **Join the [Weekly Core Implementations Call](https://github.com/ipfs/team-mgmt/issues/992)** it's where everyone discusses what's going on with IPFS and what's next
