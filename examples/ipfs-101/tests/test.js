import { node } from 'test-util-ipfs-example'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function test () {
  await node.waitForOutput('Added file contents: Hello World 101', 'node', [path.resolve(__dirname, '../index.js')])
}

test();
