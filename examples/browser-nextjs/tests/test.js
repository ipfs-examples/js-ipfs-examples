'use strict'

const { test, expect } = require('@playwright/test');
const { playwright } = require('test-util-ipfs-example');

// Setup
const play = test.extend({
  ...playwright.servers(),
});

play.describe('integrate ipfs with nextjs:', () => {
  // DOM
  const id = "[data-test=id]"
  const version = "[data-test=version]"
  const status = "[data-test=status]"

  play.beforeEach(async ({servers, page}) => {
    await page.goto(`http://localhost:${servers[0].port}/`);
  })

  play('should properly initialized a IPFS node and print some properties', async ({ page }) => {
    await page.waitForSelector(id)

    expect(await page.isVisible(id)).toBeTruthy();
    expect(await page.isVisible(version)).toBeTruthy();
    expect(await page.textContent(status)).toContain('Online');
  });
});
