'use strict'

const { test, expect } = require('@playwright/test');
const { playwright } = require('test-util-ipfs-example');

// Setup
const play = test.extend({
  ...playwright.servers(),
});

play.describe('integrate ipfs with angular:', () => {
  // DOM
  const info = "[data-test=ipfs-info]"
  const id = "[data-test=ipfs-info-id]"
  const version = "[data-test=ipfs-info-version]"
  const status = "[data-test=ipfs-info-status]"

  play.beforeEach(async ({servers, page}) => {
    await page.goto(`http://localhost:${servers[0].port}/`);
  })

  play('should properly initialized a IPFS node and print some properties', async ({ page }) => {
    await page.waitForSelector(info)

    expect(await page.isVisible(id)).toBeTruthy();
    expect(await page.isVisible(version)).toBeTruthy();
    expect(await page.textContent(status)).toContain('Online');
  });
});
