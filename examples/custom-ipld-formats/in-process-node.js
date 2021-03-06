import * as IPFS from 'ipfs-core'
import { toString as uint8ArrayToString } from 'uint8arrays/to-string'
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'

async function main () {
  // see https://github.com/multiformats/js-multiformats#multicodec-encoders--decoders--codecs for the interface definition
  const codec = {
    name: 'dag-test',
    code: 392091,
    encode: (data) => uint8ArrayFromString(JSON.stringify(data)),
    decode: (buf) => JSON.parse(uint8ArrayToString(buf))
  }

  const node = await IPFS.create({
    ipld: {
      codecs: [
        codec
      ]
    }
  })

  const data = {
    hello: 'world'
  }

  const cid = await node.dag.put(data, {
    storeCodec: 'dag-test',
    hashAlg: 'sha2-256'
  })

  console.info(`Put ${JSON.stringify(data)} = CID(${cid})`)

  const {
    value
  } = await node.dag.get(cid)

  console.info(`Get CID(${cid}) = ${JSON.stringify(value)}`)

  await node.stop()
}

main()
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
  .then(() => {
    // https://github.com/libp2p/js-libp2p/issues/779
    process.exit(0)
  })
