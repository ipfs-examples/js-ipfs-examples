import { createRequire } from "https://deno.land/std@0.102.0/node/module.ts";

// import.meta.url will be the location of "this" module (like `__filename` in
// Node.js), and then serve as the root for your "package", where the
// `package.json` is expected to be, and where the `node_modules` will be used
// for resolution of packages.
const require = createRequire(import.meta.url);

const all = require('it-all')
const uint8ArrayConcat = require('uint8arrays/concat')
const uint8ArrayFromString = require('uint8arrays/from-string')
const uint8ArrayToString = require('uint8arrays/to-string')
const IPFS = require("ipfs");

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
