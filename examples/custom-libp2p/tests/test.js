import path from 'path'
import { node } from 'test-util-ipfs-example'
import { createLibp2p } from 'libp2p'
import { TCP } from '@libp2p/tcp'
import { Mplex } from '@libp2p/mplex'
import { Noise } from '@chainsafe/libp2p-noise'
import { createEd25519PeerId } from '@libp2p/peer-id-factory'
import { toString as uint8ArrayToString } from 'uint8arrays/to-string'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function test () {
  let output = ''

  const proc = node.execa('node', [path.join(__dirname, '../index.js')], {
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

        const peerId = await createEd25519PeerId()
        const libp2p = await createLibp2p({
          peerId,
          addresses: {
            listen: ['/ip4/127.0.0.1/tcp/0']
          },
          transports: [
            new TCP()
          ],
          streamMuxers: [
            new Mplex()
          ],
          connectionEncryption: [
            new Noise()
          ]
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
