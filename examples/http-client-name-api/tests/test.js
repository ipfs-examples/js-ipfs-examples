import { test, expect } from '@playwright/test';
import { playwright } from 'test-util-ipfs-example';
import * as ipfsHttpModule from 'ipfs-http-client'
import * as goIpfsModule from 'go-ipfs'

// Setup
const play = test.extend({
  ...playwright.servers(),
  ...playwright.daemons(
    {
      ipfsHttpModule,
      ipfsBin: goIpfsModule.path(),
      args: ['--enable-pubsub-experiment']
    },
    {},
    [
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
      },
      {
        type: 'go',
        test: true
      }
    ]
  )
});

play.describe('bundle http client with webpack: ', () => {
  // DOM
  const status = "#status"

  const apiInput = "#connect-input"
  const connectBtn = "#connect-submit"

  const addFileInput = "#add-file-input"
  const addFileBtn = "#add-file-submit"

  const publishCidInput = "#publish-cid-input"
  const publishCidBtn = "#publish-cid-submit"
  const publishResult = '#publish-result'

  const resolveNameInput = "#resolve-name-input"
  const resolveNameBtn = "#resolve-name-submit"
  const resolveIpns = '#resolve-ipns'
  const resolveResult = '#resolve-result'

  play.beforeEach(async ({servers, page, daemons}) => {
    await daemons[0].api.swarm.connect(await daemons[1]._peerId.addresses[0])
    await page.goto(`http://localhost:${servers[0].port}/`);
  })

  play('should upload a file without file name and display a valid link to preview', async ({ page, daemons}) => {
    const goAddress = daemons[0].apiAddr.toString();

    await page.fill(apiInput, goAddress);
    await page.click(connectBtn);
    await page.waitForSelector(`${status}:has-text('Daemon active')`);

    const text = "hello world"

    await page.fill(addFileInput, text);
    await page.click(addFileBtn);
    await page.waitForSelector(`${status}:has-text('Success!')`);

    const ipns = await page.textContent(publishResult)
    expect(ipns).not.toBe("");

    await page.fill(resolveNameInput, ipns);
    await page.click(resolveNameBtn);
    await page.waitForSelector(`${status}:has-text('Success!')`);

    expect(await page.textContent(resolveResult)).toBe('/ipfs/Qmf412jQZiuVUtdgnB36FXFX7xg5V6KEbSJ4dpQuhkLyfD');
    expect(await page.textContent(resolveIpns)).toBe(ipns);
  });
});
