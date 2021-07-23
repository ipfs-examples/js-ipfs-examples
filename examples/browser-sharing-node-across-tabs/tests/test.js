'use strict'

const { test, expect } = require('@playwright/test');
const { playwright } = require('test-util-ipfs-example');

// Setup
const play = test.extend({
  ...playwright.servers(),
});

play.describe('share ipfs node:', () => {
  // DOM
  const link = ".ipfs-add a"
  const iframe = "iframe"
  const content = "pre"

  play.beforeEach(async ({servers, page}) => {
    await page.goto(`http://localhost:${servers[0].port}/`);
  })

  play('should properly initialized a IPFS node and share it between tabs', async ({ page, context }) => {
    expect(await page.textContent(link)).toContain("/ipfs/QmTp2hEo8eXRp6wg7jXv1BLCMh5a4F3B7buAUZNZUu772j/");

   // Get page after a specific action (e.g. clicking a link)
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      page.click(link) // Opens a new tab
    ])

    await newPage.waitForLoadState();
    await newPage.waitForSelector(iframe);

    const handle = await newPage.$(iframe)
    const contentFrame = await handle.contentFrame();

    const pre = await contentFrame.$(content);
    expect(await pre.textContent()).toBe("hello world!");
  });
});
