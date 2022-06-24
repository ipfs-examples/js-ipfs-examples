import { test } from '@playwright/test';
import { playwright } from 'test-util-ipfs-example';

// Setup
const play = test.extend({
  ...playwright.servers(),
});

play.describe('browser videostream:', () => {
  // DOM
  const status = "#status"

  play.beforeEach(async ({servers, page}) => {
    await page.goto(`http://localhost:${servers[0].port}/`);
  })

  play('should properly initialized a IPFS node and stream a video', async ({ page }) => {
    await page.waitForSelector(`${status}:has-text('Video ready')`)
  });
});
