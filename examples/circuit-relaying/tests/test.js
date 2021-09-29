'use strict'

const { test, expect } = require('@playwright/test');
const { playwright } = require('test-util-ipfs-example');
const path = require('path')
const os = require('os')
const fs = require('fs-extra')

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
      ipfsModule: require('ipfs-core'),
      ipfsHttpModule: require('ipfs-http-client')
    },
    {},
    [
      {
        type: 'proc',
        test: true,
        ipfsOptions: {
          relay: {
            enabled: true,
            hop: {
              enabled: true
            }
          },
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

play.describe('http client pubsub:', () => {
  // DOM
  const peerId = '#peer-id'
  const peerInput = '#peer'
  const peerAddress = '#peers-addrs'
  const connectBtn = '#connect'

  const messageInput = '#message'
  const messages = '#msgs'
  const sendBtn = '#send'

  const subscribe = async (page, address, id) => {
    await page.waitForSelector(peerId);
    await page.fill(peerInput, address)

    await page.click(connectBtn)
    await page.waitForSelector(`${peerAddress}:has-text('${id}')`)

    const peer = (await page.textContent(peerId)).trim();
    expect(peer).not.toBe('')

    return peer;
  }

  const connectPublish = async (page, address, remotePeerId) => {
    const relayAddr = `${address}/p2p-circuit/p2p/${remotePeerId}`
    console.info(`connecting to remote peer ${address}`)

    await page.fill(peerInput, relayAddr);
    await page.click(connectBtn);

    await page.waitForSelector(`${peerAddress}:has-text('${remotePeerId}')`)

    const message = `hello ${remotePeerId}`
    await page.fill(messageInput, message);
    await page.click(sendBtn);

    return message
  }

  play.beforeEach(async ({servers, context}) => {
    const pageOne = await context.newPage();
    const pageTwo = await context.newPage();

    await pageOne.goto(`http://localhost:${servers[0].port}/`);
    await pageTwo.goto(`http://localhost:${servers[1].port}/`);
  })

  play('should publish and subscribe topics between ipfs nodes', async ({ context, daemons}) => {
    const pages = context.pages();
    const pageOne = pages[0];
    const pageTwo = pages[1];

    const daemon = daemons[0]
    const id = await daemon.api.id()

    const IPFS_RELAY_ADDRESS = id.addresses
      .map(ma => ma.toString())
      .find(addr => addr.includes('/ws/p2p/'))
    const IPFS_RELAY_ID = id.id

    const pageOnePeerId = await subscribe(pageOne, IPFS_RELAY_ADDRESS, IPFS_RELAY_ID)
    const pageTwoPeerId = await subscribe(pageTwo, IPFS_RELAY_ADDRESS, IPFS_RELAY_ID)

    const pageOneMessage = await connectPublish(pageOne, IPFS_RELAY_ADDRESS, pageTwoPeerId)
    const pageTwoMessage = await connectPublish(pageTwo, IPFS_RELAY_ADDRESS, pageOnePeerId)

    await pageOne.waitForSelector(`${messages}:has-text('${pageOnePeerId.substr(-4)}: ${pageOneMessage}')`)
    await pageOne.waitForSelector(`${messages}:has-text('${pageTwoPeerId.substr(-4)}: ${pageTwoMessage}')`)

    await pageTwo.waitForSelector(`${messages}:has-text('${pageOnePeerId.substr(-4)}: ${pageOneMessage}')`)
    await pageTwo.waitForSelector(`${messages}:has-text('${pageTwoPeerId.substr(-4)}: ${pageTwoMessage}')`)
  });
});
