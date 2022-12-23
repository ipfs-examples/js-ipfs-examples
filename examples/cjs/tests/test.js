const path = require('path')

async function main () {
  const { node } = await import('test-util-ipfs-example')

  async function test () {
    await node.waitForOutput('Added file contents: Hello World 101', 'node', [path.resolve(__dirname, '../index.js')])
  }

  test();
}

main()
