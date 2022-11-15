'use strict'

import all from 'https://dev.jspm.io/it-all'
import uint8ArrayConcat from 'https://dev.jspm.io/uint8arrays/concat'
import uint8ArrayFromString from 'https://dev.jspm.io/uint8arrays/from-string'
import uint8ArrayToString from 'https://dev.jspm.io/uint8arrays/to-string'
import IPFS from 'https://dev.jspm.io/ipfs'

async function main () {
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
