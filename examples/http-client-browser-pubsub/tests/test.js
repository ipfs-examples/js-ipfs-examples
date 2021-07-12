'use strict'

const { test } = require('@playwright/test');
const { playwright } = require('test-util-ipfs-example');

// Setup
const play = test.extend({
  ...playwright.servers(),
  ...playwright.daemons(
    {
      ipfsHttpModule: require('ipfs-http-client'),
    },
    {
      js: {
        ipfsBin: require.resolve('ipfs/src/cli.js')
      },
      go: {
        ipfsBin: require('go-ipfs').path(),
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

    const jsDaemon = daemons.find(m => m.api.peerId.agentVersion.includes("js-ipfs"))
    const goDaemon = daemons.find(m => m.api.peerId.agentVersion.includes("go-ipfs"))

    let jsAddress = jsDaemon.apiAddr.toString().split('/');
    jsAddress.pop();
    jsAddress = jsAddress.join('/')
    const jsPeerId = jsDaemon.api.peerId.id.toString();

    const goAddress = goDaemon.apiAddr.toString();
    const goPeerId = goDaemon.api.peerId.id.toString();

    // Connect to API
    console.log("Page 1: ")
    console.log(jsAddress)
    console.log(jsPeerId)
    console.log(`${goAddress}/ipfs/${goPeerId}`)

    console.log("Page 2: ")
    console.log(goAddress)
    console.log(goPeerId)
    console.log(`${jsAddress}/ipfs/${jsPeerId}`)

    await pageOne.fill(apiInput, jsAddress);
    await pageOne.click(connectBtn);
    await pageOne.waitForSelector(`${output}:has-text('Connecting to ${jsAddress}')`);

    await pageTwo.fill(apiInput, goAddress);
    await pageTwo.click(connectBtn);
    await pageTwo.waitForSelector(`${output}:has-text('Connecting to ${goAddress}')`);

    // Connect to Peer

    await pageOne.fill(peerAddressInput, `${goAddress}/ipfs/${goPeerId}`);
    await pageOne.click(peerAddressBtn);
    await pageOne.waitForSelector(`${output}:has-text('Connecting to peer ${goAddress}')`);

    await pageTwo.fill(peerAddressInput, `${jsAddress}/ipfs/${jsPeerId}`);
    await pageTwo.click(peerAddressBtn);
    await pageTwo.waitForSelector(`${output}:has-text('Connecting to peer ${jsAddress}')`);

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

    console.log(await (await pageOne.$(output)).textContent())
    console.log(await (await pageTwo.$(output)).textContent())
    await pageTwo.waitForSelector(`${output}:has-text('${messageJS}')`);

    // Send message from GO to JS
    const messageGO = 'hello from go';

    await pageTwo.fill(messageInput, messageGO);
    await pageTwo.click(sendBtn);
    await pageTwo.waitForSelector(`${output}:has-text('Sending message to ${topic}')`);
    await pageOne.waitForSelector(`${output}:has-text('${messageGO}')`);
  });
});
