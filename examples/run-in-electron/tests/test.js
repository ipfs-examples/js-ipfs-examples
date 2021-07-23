'use strict'

const { node } = require('test-util-ipfs-example');

async function test () {
  await node.waitForOutput('protocolVersion', 'npm', ['run', 'start'], {
    cwd: __dirname
  })
}

test();
