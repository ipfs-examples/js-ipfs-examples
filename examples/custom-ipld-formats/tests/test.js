import path from 'path'
import { node } from 'test-util-ipfs-example'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const testInProcessNode = async () => {
  await node.waitForOutput(
    'Put {"hello":"world"} = CID(bagn7ofysecj2eolrvekol2wl6cuneukuzwrqtq6by4x3xgiu2r6gb46lnakyq)\n' +
    'Get CID(bagn7ofysecj2eolrvekol2wl6cuneukuzwrqtq6by4x3xgiu2r6gb46lnakyq) = {"hello":"world"}', 'node', [path.resolve(__dirname, '../in-process-node.js')])
}

const testDaemonNode = async () => {
  await node.waitForOutput(
    'Put {"hello":"world"} = CID(bagn7ofysecj2eolrvekol2wl6cuneukuzwrqtq6by4x3xgiu2r6gb46lnakyq)\n' +
    'Get CID(bagn7ofysecj2eolrvekol2wl6cuneukuzwrqtq6by4x3xgiu2r6gb46lnakyq) = {"hello":"world"}', 'node', [path.resolve(__dirname, '../daemon-node.js')])
}

async function test () {
  console.info('Testing in-process node')
  await testInProcessNode()

  console.info('Testing daemon node')
  await testDaemonNode()
}

test();
