'use strict'

const webRTCStarSigServer = require('libp2p-webrtc-star/src/sig-server')

const { test, expect } = require('@playwright/test');
const { playwright } = require('test-util-ipfs-example');

// Setup
const play = test.extend({
  ...playwright.servers(
    [
      {
        portToUse: 3000,
        folderToServe: 'dist'
      },
      {
        portToUse: 3001,
        folderToServe: 'dist'
      }
    ]
  ),
  ...playwright.daemons(
    {
      ipfsModule: require('ipfs'),
      ipfsHttpModule: require('ipfs-http-client')
    }, {
      js: {
        ipfsBin: require.resolve('ipfs/src/cli.js')
      }
    },
    [
      {
        type: 'js',
        ipfsOptions: {
          config: {
            Addresses: {
              Swarm: [
                '/ip4/127.0.0.1/tcp/0/ws'
              ]
            }
          }
        }
      }
    ]
  )
});

test.setTimeout(1000 * 60 * 2);

play.describe('upload file using http client: ', () => {
  // DOM
  const nodeId = '.node-id'
  const connectedPeers = '#connected-peers tr td'
  const multiAddressInput ="#multiaddr-input"
  const peerBtn ="#peer-btn"
  const peers ="#peers tr td"

  const workspaceInput = '#workspace-input'
  const workspacePeers = '#workspace-peers'
  const workspaceBtn = '#workspace-btn'

  const cidInput = '#cid-input'
  const fetchBtn = '#fetch-btn'
  const fileHistory = '#file-history'

  const FILE_CONTENT = 'A file with some content'
  const WORKSPACE = 'test-workspace'

  const connect = async (page, address) => {
    await page.waitForSelector(connectedPeers)

    await page.fill(multiAddressInput, address)
    await page.click(peerBtn)

    const IPFS_RELAY_ID = address.split('/').pop()
    await page.waitForSelector(`${peers}:has-text('${IPFS_RELAY_ID}')`)
  }

  const subscribe = async (page, workspace) => {
    await page.fill(workspaceInput, workspace)
    await page.click(workspaceBtn)
  }

  let sigServer;

  play.beforeAll(async () => {
    sigServer = await webRTCStarSigServer.start({
      host: '127.0.0.1',
      port: 13579
    })
  })

  play.afterAll(async () => {
    if (sigServer) {
      await sigServer.stop()
    }
  })

  play.beforeEach(async ({servers, context}) => {
    const pageOne = await context.newPage();
    const pageTwo = await context.newPage();

    await pageOne.goto(`http://localhost:${servers[0].port}/`);
    await pageTwo.goto(`http://localhost:${servers[1].port}/`);
  })

  play('should upload a file without file name and display a valid link to preview', async ({ context, daemons }) => {
    // Add file
    const daemon = daemons[0];
    const { cid } = await daemon.api.add(FILE_CONTENT)

    const pages = context.pages();
    const pageOne = pages[0];
    const pageTwo = pages[1];

    const id = await daemon.api.id()
    const IPFS_RELAY_ADDRESS = id.addresses
      .map(ma => ma.toString())
      .find(addr => addr.includes('/ws/p2p/'))

    if (!IPFS_RELAY_ADDRESS) {
      throw new Error(`Could not find web socket address in ${id.addresses}`)
    }

    const pageOnePeerId = (await pageOne.textContent(nodeId)).trim()
    const pageTwoPeerId = (await pageTwo.textContent(nodeId)).trim()

    await connect(pageOne, IPFS_RELAY_ADDRESS)
    await connect(pageTwo, IPFS_RELAY_ADDRESS)

    await subscribe(pageOne, WORKSPACE, pageTwoPeerId)
    await subscribe(pageTwo, WORKSPACE, pageOnePeerId)

    await pageOne.waitForSelector(`${workspacePeers}:has-text('${pageTwoPeerId}')`, {
      timeout: 10000
    })
    await pageTwo.waitForSelector(`${workspacePeers}:has-text('${pageOnePeerId}')` , {
      timeout: 10000
    })

    // only one browser should add the file to the workspace
    await pageOne.fill(cidInput, cid.toString())
    await pageOne.click(fetchBtn);

    // but should both see the added file
    await pageOne.waitForSelector(`${fileHistory}:has-text('${cid.toString()}')`)
    let passed = false;

    for (let index = 0; index < 3; index++) {
      await pageTwo.waitForTimeout(15000)
      const contentHistory = await pageTwo.textContent(fileHistory)
      passed = contentHistory.includes(cid.toString())

      if (passed) {
        break
      } else {
        await pageTwo.reload();
      }
    }

    expect(passed).toBeTruthy()
  });

});
