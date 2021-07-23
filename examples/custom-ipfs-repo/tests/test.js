'use strict'

const { node } = require('test-util-ipfs-example');
const path = require('path')
const fs = require('fs')

async function test () {
  await node.execa('node', [path.join(__dirname, '../index.js')], {
    cwd: path.resolve(__dirname),
    all: true
  }, (exec) => {
    exec.all.on('data', (data) => {
      process.stdout.write(data)
    })
  })

  if (!fs.existsSync('/tmp/custom-repo/.ipfs')) {
    throw new Error('Custom repo was not created at /tmp/custom-repo/.ipfs')
  }
}

test();
