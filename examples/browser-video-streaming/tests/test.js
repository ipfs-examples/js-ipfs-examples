'use strict'

'use strict'

const { test } = require('@playwright/test');
const { playwright } = require('test-util-ipfs-example');

// Setup
const play = test.extend({
  ...playwright.servers(),
});

play.describe('browser videostream:', () => {
  // DOM
  const video = "#video"

  play.beforeEach(async ({servers, page}) => {
    await page.goto(`http://localhost:${servers[0].port}/`);
  })

  play('should properly initialized a IPFS node and stream a video', async ({ page }) => {
    await page.waitForFunction((el) => document.querySelector(el).readyState >= 2, video);
  });
});
