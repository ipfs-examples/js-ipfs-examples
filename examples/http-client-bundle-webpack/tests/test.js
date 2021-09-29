'use strict'

const { test, expect } = require('@playwright/test');
const { playwright } = require('test-util-ipfs-example');

// Setup
const play = test.extend({
  ...playwright.servers(),
  ...playwright.daemons(
    {
      ipfsHttpModule: require('ipfs-http-client'),
      ipfsBin: require('ipfs').path()
    },
    {},
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
      }
    ]
  )
});

play.describe('bundle http client with webpack:', () => {
  // DOM
  const textInput = "#connect-text"
  const apiInput = "#connect-input"
  const connectBtn = "#connect-submit"

  const dataTestId = "data-test=id"
  const dataTestVersion = "data-test=version"
  const dataTestProtocolVersion = "data-test=protocol-version"
  const dataTestAddedFile = "data-test=added-file"
  const dataTestContent = "data-test=content"

  play.beforeEach(async ({servers, page}) => {
    await page.goto(`http://localhost:${servers[0].port}/`);
  })

  play('should upload a file without file name and display a valid link to preview', async ({ page, daemons}) => {
    const jsDaemon = daemons.find(m => m.api.peerId.agentVersion.includes("js-ipfs"))

    let jsAddress = jsDaemon.apiAddr.toString().split('/');
    jsAddress.pop();
    jsAddress = jsAddress.join('/')
    const jsPeerId = jsDaemon.api.peerId.id.toString();

    const text = "hello world from webpack IPFS"
    await page.fill(textInput, text);
    await page.fill(apiInput, jsAddress);
    await page.click(connectBtn);

    expect(await page.textContent(dataTestId)).toBe(jsPeerId);
    expect(await page.textContent(dataTestVersion)).toContain('js-ipfs');
    expect(await page.textContent(dataTestProtocolVersion)).toContain('ipfs');
    expect(await page.textContent(dataTestAddedFile)).toBe('QmYAZfMmyxedMsTAWKGRNSmnzrwCTkknT1HEArfucUz22t');
    expect(await page.textContent(dataTestContent)).toBe(text);
  });
});
