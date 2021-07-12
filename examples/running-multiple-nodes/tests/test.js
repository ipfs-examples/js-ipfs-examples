'use strict'

const IPFS = require('ipfs')
const os = require('os')
const path = require('path')
const { nanoid } = require('nanoid')
const { node } = require('test-util-ipfs-example');

async function startCliNode () {
  const repoDir = path.join(os.tmpdir(), `repo-${nanoid()}`)

  const opts = {
    env: {
      ...process.env,
      IPFS_PATH: repoDir
    }
  }

  const ipfs = require.resolve('ipfs/src/cli.js')

  await node.execa(ipfs, ['init'], opts)
  await node.execa(ipfs, ['config', 'Addresses.Swarm', '--json', JSON.stringify([`/ip4/0.0.0.0/tcp/0`, `/ip4/127.0.0.1/tcp/0/ws`])], opts)
  await node.execa(ipfs, ['config', 'Addresses.API', `/ip4/127.0.0.1/tcp/0`], opts)
  await node.execa(ipfs, ['config', 'Addresses.Gateway', `/ip4/127.0.0.1/tcp/0`], opts)
  await node.execa(ipfs, ['config', 'Addresses.RPC', `/ip4/127.0.0.1/tcp/0`], opts)

  await node.waitForOutput('Daemon is ready', ipfs, ['daemon'], opts)
}

async function startProgramaticNode () {
  const repoDir = path.join(os.tmpdir(), `repo-${nanoid()}`)

  const node = await IPFS.create({
    repo: repoDir,
    config: {
      Addresses: {
        Swarm: [
          `/ip4/0.0.0.0/tcp/0`,
          `/ip4/127.0.0.1/tcp/0/ws`
        ],
        API: `/ip4/127.0.0.1/tcp/0`,
        Gateway: `/ip4/127.0.0.1/tcp/0`,
        RPC: `/ip4/127.0.0.1/tcp/0`
      },
      Bootstrap: []
    }
  })

  console.info('Stopping programmatic node')
  await node.stop()
}

async function runTest () {
  console.info('Testing CLI recipe')

  await Promise.all([
    startCliNode(),
    startCliNode()
  ])

  console.info('Testing Programmatic recipe')

  await Promise.all([
    startProgramaticNode(),
    startProgramaticNode()
  ])

  console.info('Done!')
}

runTest()
