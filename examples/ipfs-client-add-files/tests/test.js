'use strict'

const { test, expect } = require('@playwright/test');
const { playwright } = require('test-util-ipfs-example');

// Setup
const play = test.extend({
  ...playwright.servers(),
  ...playwright.daemons(
    {
      ipfsClientModule: require('ipfs-client'),
      ipfsBin: require.resolve('ipfs/src/cli.js')
    },
    {},
    [
      {
        type: 'js',
        test: true,
        ipfsOptions: {
          config: {
            Addresses: {
              API: '/ip4/127.0.0.1/tcp/0',
              RPC: '/ip4/127.0.0.1/tcp/0'
            },
            API: {
              HTTPHeaders: {
                'Access-Control-Allow-Origin': [
                  "*"
                ]
              }
            }
          }
        }
      }
    ]
  )
});

play.describe('bundle http client with webpack: ', () => {
  // DOM
  const grpcInput = "#grpc-input"
  const httpInput = "#http-input"
  const connectBtn = "#connect-submit"
  const output = "#output"

  play.beforeEach(async ({servers, page}) => {
    await page.goto(`http://localhost:${servers[0].port}/`);
  })

  play('should upload a file without file name and display a valid link to preview', async ({ page, daemons}) => {
    const jsDaemon = daemons[0]

    let apiAddress = jsDaemon.apiAddr.toString().split('/');
    apiAddress.pop();
    apiAddress = apiAddress.join('/')

    const grpcAddress = jsDaemon.grpcAddr.toString()

    await page.fill(grpcInput, grpcAddress);
    await page.fill(httpInput, apiAddress);
    await page.click(connectBtn);

    await page.waitForSelector(`${output}:has-text('Added file: QmU5vpAQsrgJ8zFZMzncGTT1xNs6Ls1PU3XF8T8RmVKk5o')`);

    expect(await page.textContent(output)).toContain(`Connecting to ${grpcAddress} using ${apiAddress} as fallbackDaemon`)
    expect(await page.textContent(output)).toContain('Added file: file-0.txt QmUDLiEJwL3vUhhXNXDF2RrCnVkSB2LemWYffpCCPcQCeU')
  });
});
