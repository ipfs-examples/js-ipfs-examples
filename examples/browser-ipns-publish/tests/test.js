'use strict'

const { test, expect } = require('@playwright/test');
const { playwright } = require('test-util-ipfs-example');

// Setup
const play = test.extend({
  ...playwright.servers(),
  ...playwright.daemons(
    {
      ipfsHttpModule: require("ipfs-http-client"),
      ipfsBin: require("go-ipfs").path(),
      args: [
        "--enable-pubsub-experiment",
        '--enable-namesys-pubsub'
      ],
      test: true
    },
    {},
    [
      {
        ipfsOptions: {
          config: {
            Addresses: {
              API: "/ip4/127.0.0.1/tcp/0",
              Swarm: [
                "/ip4/127.0.0.1/tcp/0/ws"
              ]
            },
            API: {
              HTTPHeaders: {
                "Access-Control-Allow-Origin": ["*"],
              },
            },
          },
        },
      },
      {}
    ]
  )
});

play.describe('http ipns publish:', () => {
  // DOM
  const apiSelector = "#api-url:enabled";
  const nodeConnect = "#node-connect";

  const consoleDOM = "#console"
  const peerAddrEnabled = "#peer-addr:enabled"

  const peerConnect = "#peer-connect"
  const topicEnabled = "#topic:enabled"

  const publish = "#publish"

  play.beforeEach(async ({servers, page, daemons}) => {
    await daemons[0].api.swarm.connect(await daemons[1].api.peerId.addresses[0])

    await page.goto(`http://localhost:${servers[0].port}/`);
  })

  play('should connect to IPFS node and publish a file via ipns', async ({ page, daemons}) => {
    const goNode = daemons[0];
    const apiAddress = goNode.apiAddr.toString();

    const { cid } = await goNode.api.add(`Some data ${Date.now()}`)
    const topic = `/ipfs/${cid}`;

    const peerAddr = goNode.api.peerId.addresses
      .map(addr => addr.toString())
      .filter(addr => addr.includes("/ws/p2p/"))
      .pop()

    await page.waitForSelector(apiSelector);
    await page.fill(apiSelector, apiAddress);
    await page.click(nodeConnect);
    await page.waitForSelector(`${consoleDOM}:has-text('Connecting to ${apiAddress}')`);

    await page.waitForSelector(peerAddrEnabled);
    await page.fill(peerAddrEnabled, peerAddr);
    await page.click(peerConnect);
    await page.waitForSelector(`${consoleDOM}:has-text('Connecting to peer ${peerAddr}')`);

    await page.waitForSelector(topicEnabled);
    await page.fill(topicEnabled, topic);
    await page.click(publish);
    await page.waitForSelector(`${consoleDOM}:has-text('IPNS Publish Success!')`);

    const consoleContent = await page.textContent(consoleDOM)
    expect(consoleContent).toContain('Publish to IPNS')
    expect(consoleContent).toContain('Initial Resolve')
    expect(consoleContent).toContain('Published')
  });
});
