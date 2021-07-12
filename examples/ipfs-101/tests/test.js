'use strict'

const { node } = require('test-util-ipfs-example');
const path = require('path')

async function test () {
  await node.waitForOutput('Added file contents: Hello World 101', 'node', [path.resolve(__dirname, '../index.js')])
}

test();
