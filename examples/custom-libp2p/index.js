import { createLibp2p } from 'libp2p'
import * as IPFS from 'ipfs-core'
import { TCP } from '@libp2p/tcp'
import { MulticastDNS } from '@libp2p/mdns'
import { Bootstrap } from '@libp2p/bootstrap'
import { KadDHT } from '@libp2p/kad-dht'
import { Mplex } from '@libp2p/mplex'
import { Noise } from '@chainsafe/libp2p-noise'

/**
 * Options for the libp2p bundle
 * @typedef {Object} libp2pBundle~options
 * @property {PeerId} peerId - The PeerId of the IPFS node
 * @property {Object} config - The config of the IPFS node
 * @property {Object} options - The options given to the IPFS node
 */

/**
 * This is the bundle we will use to create our fully customized libp2p bundle.
 *
 * @param {libp2pBundle~options} opts The options to use when generating the libp2p node
 * @returns {Libp2p} Our new libp2p node
 */
const libp2pBundle = (opts) => {
  // Set convenience variables to clearly showcase some of the useful things that are available
  const peerId = opts.peerId
  const bootstrapList = opts.config.Bootstrap

  // Build and return our libp2p node
  // n.b. for full configuration options, see https://github.com/libp2p/js-libp2p/blob/master/doc/CONFIGURATION.md
  return createLibp2p({
    peerId,
    addresses: {
      listen: ['/ip4/127.0.0.1/tcp/0']
    },
    // Lets limit the connection managers peers and have it check peer health less frequently
    connectionManager: {
      minPeers: 25,
      maxPeers: 100,
      pollInterval: 5000,
      autoDial: true, // auto dial to peers we find when we have less peers than `connectionManager.minPeers`
    },
    transports: [
      new TCP()
    ],
    streamMuxers: [
      new Mplex()
    ],
    connectionEncryption: [
      new Noise()
    ],
    peerDiscovery: [
      new MulticastDNS({
        interval: 10000
      }),
      new Bootstrap({
        interval: 30e3,
        list: bootstrapList
      })
    ],
    dht: new KadDHT(),
    // Turn on relay with hop active so we can connect to more peers
    relay: {
      enabled: true,
      hop: {
        enabled: true,
        active: true
      }
    },
    metrics: {
      enabled: true,
      computeThrottleMaxQueueSize: 1000,  // How many messages a stat will queue before processing
      computeThrottleTimeout: 2000,       // Time in milliseconds a stat will wait, after the last item was added, before processing
      movingAverageIntervals: [           // The moving averages that will be computed
        60 * 1000, // 1 minute
        5 * 60 * 1000, // 5 minutes
        15 * 60 * 1000 // 15 minutes
      ],
      maxOldPeersRetention: 50            // How many disconnected peers we will retain stats for
    }
  })
}

async function main () {
  // Now that we have our custom libp2p bundle, let's start up the ipfs node!
  const node = await IPFS.create({
    libp2p: libp2pBundle
  })

  // Lets log out the number of peers we have every 2 seconds
  setInterval(async () => {
    try {
      const peers = await node.swarm.peers()
      console.log(`The node now has ${peers.length} peers.`)
    } catch (err) {
      console.log('An error occurred trying to check our peers:', err)
    }
  }, 2000)

  // Log out the bandwidth stats every 4 seconds so we can see how our configuration is doing
  setInterval(async () => {
    try {
      const stats = await node.stats.bw()
      console.log(`\nBandwidth Stats: ${JSON.stringify(stats, null, 2)}\n`)
    } catch (err) {
      console.log('An error occurred trying to check our stats:', err)
    }
  }, 4000)
}

main()
