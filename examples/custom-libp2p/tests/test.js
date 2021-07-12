'use strict'

const path = require('path')
const { node } = require('test-util-ipfs-example');
const Libp2p = require('libp2p')
const TCP = require('libp2p-tcp')
const MPLEX = require('libp2p-mplex')
const { NOISE } = require('libp2p-noise')
const PeerId = require('peer-id')
const uint8ArrayToString = require('uint8arrays/to-string')

async function test () {
  let output = ''

  const proc = node.execa('node', [path.join(__dirname, 'index.js')], {
    cwd: path.resolve(__dirname),
    all: true
  }, (exec) => {
    exec.all.on('data', async (data) => {
      process.stdout.write(data)

      output += uint8ArrayToString(data)

      if (output.includes('The node now has')) {
        // the node has started up, try to dial it
        const address = output.trim().match(/Swarm listening on (.*)\n/)[1]

        console.info('Dialling', address)

        const peerId = await PeerId.create()
        const libp2p = await Libp2p.create({
          peerId,
          addresses: {
            listen: ['/ip4/127.0.0.1/tcp/0']
          },
          modules: {
            transport: [
              TCP
            ],
            streamMuxer: [
              MPLEX
            ],
            connEncryption: [
              NOISE
            ]
          }
        })
        await libp2p.start()
        await libp2p.dial(address)

        console.info('Dialled', address)

        exec.kill()

        await libp2p.stop()
      }
    })
  })

  await proc.catch(() => {
    // throw new Error('libp2p should have been killed')
  }, (err) => {
    if (err.exitSignal !== 'SIGTERM') {
      throw err
    }
  })
}

test();
