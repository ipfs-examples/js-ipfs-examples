import { test, expect } from '@playwright/test';
import path from 'path'
import { playwright } from 'test-util-ipfs-example';
import { fileURLToPath } from 'url'
import * as ipfsModule from 'ipfs'
import * as ipfsHttpModule from 'ipfs-http-client'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Setup
const play = test.extend({
  ...playwright.servers(),
  ...playwright.daemons(
    {
      ipfsHttpModule,
      ipfsBin: ipfsModule.path()
    },
    {},
    [
      {
        type: 'js',
        test: true,
        ipfsOptions: {
          config: {
            Addresses: {
              API: `/ip4/127.0.0.1/tcp/6001`
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

play.describe('upload file using http client: ', () => {
  // DOM
  const connectInput = "#connect-input"
  const connectSubmit = "#connect-submit"
  const inputFileContainer = '#capture-media'
  const inputFile = '#input-file'
  const imagePath = './../img/screenshot.png'
  const keepFileName = '#keep-filename'

  play.beforeEach(async ({page, servers}) => {
    await page.goto(`http://localhost:${servers[0].port}/`);
  })

  play('should upload a file without file name and display a valid link to preview', async ({ page, daemons }) => {
    // Connect to IPFS
    await page.waitForSelector(connectInput)
    await page.fill(connectInput, daemons[0].apiAddr.toString());
    await page.click(connectSubmit);

    // upload file
    await page.waitForSelector(inputFileContainer)
    await page.setInputFiles(inputFile, path.resolve(__dirname + imagePath));

    // Check gateway
    const gateway = await page.textContent('[href="https://ipfs.io/ipfs/QmWGmeq2kxsXqhrPhtTEhvck6PXucPf5153PSpZZRxvTwT"]')
    expect(gateway).toEqual("QmWGmeq2kxsXqhrPhtTEhvck6PXucPf5153PSpZZRxvTwT");
  });

  play('should properly upload a file with file name and display a valid link to preview', async ({ page, daemons }) => {
    // Connect to IPFS
    await page.waitForSelector(connectInput)
    await page.fill(connectInput, daemons[0].apiAddr.toString());
    await page.click(connectSubmit);

    // upload file with file name
    await page.waitForSelector(inputFileContainer)
    await page.check(keepFileName);

    // Assert the checked state
    expect(await page.isChecked(keepFileName)).toBeTruthy()
    await page.click(inputFile);

    await page.setInputFiles(inputFile, path.resolve(__dirname + imagePath));

    // Check gateway
    const gateway = await page.textContent('[href="https://ipfs.io/ipfs/QmPJw5AYXfbqYXRX51zmdm7itSdt5tAWfGLSehwAhizLqp"]')
    expect(gateway).toEqual("QmPJw5AYXfbqYXRX51zmdm7itSdt5tAWfGLSehwAhizLqp");
  });
});
