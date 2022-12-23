async function main () {
  const IPFS = await import('ipfs-core')
  const { default: all } = await import('it-all')
  const { concat: uint8ArrayConcat } = await import('uint8arrays/concat')
  const { fromString: uint8ArrayFromString } = await import('uint8arrays/from-string')
  const { toString: uint8ArrayToString } = await import('uint8arrays/to-string')

  const node = await IPFS.create()
  const version = await node.version()

  console.log('Version:', version.version)

  const file = await node.add({
    path: 'hello.txt',
    content: uint8ArrayFromString('Hello World 101')
  })

  console.log('Added file:', file.path, file.cid.toString())

  const data = uint8ArrayConcat(await all(node.cat(file.cid)))

  console.log('Added file contents:', uint8ArrayToString(data))
}

main()
