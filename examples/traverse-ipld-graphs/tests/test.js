'use strict'

const path = require('path')
const { node } = require('test-util-ipfs-example');

async function runTest () {
  console.info('Testing put.js')
  await node.waitForOutput('bafyreigsccjrxlioppkkzv27se4gxh2aygbxfnsobkaxxqiuni544uk66a', 'node', [path.resolve(__dirname, '../put.js')])

  console.info('Testing get.js')
  await node.waitForOutput('{"name":"David","likes":["js-ipfs","icecream","steak"]}', 'node', [path.resolve(__dirname, '../get.js')])

  console.info('Testing get-path.js')
  await node.waitForOutput('js-ipfs', 'node', [path.resolve(__dirname, '../get-path.js')])

  console.info('Testing get-path-accross-formats.js')
  await node.waitForOutput('capoeira', 'node', [path.resolve(__dirname, '../get-path-accross-formats.js')])

  console.info('Testing eth.js')
  await node.waitForOutput('302516', 'node', [path.resolve(__dirname, '../eth.js')])

  console.info('Testing git.js')
  await node.waitForOutput("CID(baf4bcfhoohhpkaa3qsydcrby65wpblgthcrp2ii)", 'node', [path.resolve(__dirname, '../git.js')])

  console.info('Done!')
}

runTest()
