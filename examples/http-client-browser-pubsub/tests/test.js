import { test } from '@playwright/test';
import { playwright } from 'test-util-ipfs-example'
import * as ipfsModule from 'ipfs'
import * as ipfsHttpModule from 'ipfs-http-client'
import * as goIpfsModule from 'go-ipfs'

// Setup
const play = test.extend({
  ...playwright.servers(),
  ...playwright.daemons(
    {
      ipfsHttpModule,
    },
    {
      js: {
        ipfsBin: ipfsModule.path()
      },
      go: {
        ipfsBin: goIpfsModule.path(),
        args: ['--enable-pubsub-experiment']
      }
    },
    [
      {
        type: 'js',
        test: true,
        ipfsOptions: {
          config: {
            Addresses: {
              API: '/ip4/127.0.0.1/tcp/0'
            },
            API: {
              HTTPHeaders: {
                'Access-Control-Allow-Origin': [
                  '*'
                ]
              }
            }
          }
        }
      },
      {
        type: 'go',
        test: true,
        ipfsOptions: {
          config: {
            Addresses: {
              API: '/ip4/127.0.0.1/tcp/0'
            },
            API: {
              HTTPHeaders: {
                'Access-Control-Allow-Origin': [
                  '*'
                ]
              }
            }
          }
        }
      }
    ]
  )
});

play.describe('http client pubsub:', () => {
  // DOM
  const apiInput = "#api-url"
  const connectBtn = "#node-connect"

  const peerAddressInput = '#peer-addr'
  const peerAddressBtn = '#peer-connect'

  const topicInput = "#topic"
  const subscribeBtn = "#subscribe"

  const messageInput = "#message"
  const sendBtn = "#send"

  const output = "#console"

  play.beforeEach(async ({servers, context}) => {
    const pageOne = await context.newPage();
    const pageTwo = await context.newPage();

    await pageOne.goto(`http://localhost:${servers[0].port}/`);
    await pageTwo.goto(`http://localhost:${servers[0].port}/`);
  })

  play('should be possible to publish and subscribe topics between ipfs nodes', async ({ context, daemons}) => {
    const pages = context.pages();
    const pageOne = pages[0];
    const pageTwo = pages[1];

    const jsDaemon = daemons.find(m => {
      console.info(m._peerId.agentVersion)
      return m._peerId.agentVersion.includes("js-ipfs")
    })
    const goDaemon = daemons.find(m => m._peerId.agentVersion.includes("go-ipfs"))

    const goAddress = goDaemon.apiAddr.toString();
    const jsAddress = jsDaemon.apiAddr.toString()

    const goPeerIdAddress = goDaemon._peerId.addresses[0].toString()
    const jsPeerIdAddress = jsDaemon._peerId.addresses[0].toString()

    await pageOne.fill(apiInput, jsAddress);
    await pageOne.click(connectBtn);
    await pageOne.waitForSelector(`${output}:has-text('Connecting to ${jsAddress}')`);

    await pageTwo.fill(apiInput, goAddress);
    await pageTwo.click(connectBtn);
    await pageTwo.waitForSelector(`${output}:has-text('Connecting to ${goAddress}')`);

    // Connect to Peer
    await pageOne.fill(peerAddressInput, goPeerIdAddress);
    await pageOne.click(peerAddressBtn);
    await pageOne.waitForSelector(`${output}:has-text('Connecting to peer ${goPeerIdAddress}')`);

    await pageTwo.fill(peerAddressInput, jsPeerIdAddress);
    await pageTwo.click(peerAddressBtn);
    await pageTwo.waitForSelector(`${output}:has-text('Connecting to peer ${jsPeerIdAddress}')`);

    // Subscribe topic
    const topic = 'test-topic';

    await pageOne.fill(topicInput, topic);
    await pageOne.click(subscribeBtn);
    await pageOne.waitForSelector(`${output}:has-text('Subscribing to ${topic}')`);

    await pageTwo.fill(topicInput, topic);
    await pageTwo.click(subscribeBtn);
    await pageTwo.waitForSelector(`${output}:has-text('Subscribing to ${topic}')`);

    // Send message from JS to GO
    const messageJS = 'hello from js';

    await pageOne.fill(messageInput, messageJS);
    await pageOne.click(sendBtn);
    await pageOne.waitForSelector(`${output}:has-text('Sending message to ${topic}')`);

    await pageTwo.waitForSelector(`${output}:has-text('${messageJS}')`);

    // Send message from GO to JS
    const messageGO = 'hello from go';

    await pageTwo.fill(messageInput, messageGO);
    await pageTwo.click(sendBtn);
    await pageTwo.waitForSelector(`${output}:has-text('Sending message to ${topic}')`);
    await pageOne.waitForSelector(`${output}:has-text('${messageGO}')`);
  });
});
