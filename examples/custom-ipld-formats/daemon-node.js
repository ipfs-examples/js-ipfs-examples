const { Daemon } = require('ipfs-daemon')
const ipfsHttpClient = require('ipfs-http-client')
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

  // start an IPFS Daemon
  const daemon = new Daemon({
    ipld: {
      codecs: [
        codec
      ]
    }
  })
  await daemon.start()

  // in another process:
  const client = ipfsHttpClient.create({
    url: `http://localhost:${daemon._httpApi._apiServers[0].info.port}`,
    ipld: {
      codecs: [
        codec
      ]
    }
  })

  const data = {
    hello: 'world'
  }

  // we cannot use the DAG API to put a custom codec unless that codec is on
  // the server and can handle our input data, but the BLOCK API accepts our
  // encoded bytes and "format"
  const encoded = codec.encode(data)
  const cid = await client.block.put(encoded, {
    format: 'dag-test',
    mhtype: 'sha2-256'
  })

  console.info(`BLOCK Put ${JSON.stringify(data)} = CID(${cid})`)

  // as with PUT, we can't use the DAG API to get the block unless the server
  // knows how about the codec, instead we use the BLOCK API to get the raw
  // bytes and decode it locally
  const bytes = await client.block.get(cid)
  const value = codec.decode(bytes)

  console.info(`BLOCK Get CID(${cid}) = ${JSON.stringify(value)}`)

  await daemon.stop()
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
