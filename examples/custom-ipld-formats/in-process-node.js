'use strict'

const IPFS = require('ipfs-core')
const { toString: uint8ArrayToString } = require('uint8arrays/to-string')
const { fromString: uint8ArrayFromString } = require('uint8arrays/from-string')

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

  // we can use the DAG API for an in-process IPFS since we're adding the codec
  // directly into IPFS which will do the encoding and decoding
  const dagApi = async () => {
    const cid = await node.dag.put(data, {
      storeCodec: 'dag-test',
      hashAlg: 'sha2-256'
    })

    console.info(`DAG Put ${JSON.stringify(data)} = CID(${cid})`)

    const {
      value
    } = await node.dag.get(cid)

    console.info(`DAG Get CID(${cid}) = ${JSON.stringify(value)}`)
  }

  // alternatively we can use the codec directly and put the encoded bytes
  // into IPFS using the BLOCK API and then decode with the codec from the
  // bytes fetched from IPFS
  const blockApi = async () => {
    const encoded = codec.encode(data)
    const cid = await node.block.put(encoded, {
      format: 'dag-test',
      mhtype: 'sha2-256',
      version: 1
    })

    console.info(`BLOCK Put ${JSON.stringify(data)} = CID(${cid})`)

    const bytes = await node.block.get(cid)
    const value = codec.decode(bytes)

    console.info(`BLOCK Get CID(${cid}) = ${JSON.stringify(value)}`)
  }

  await dagApi()
  await blockApi()

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
