'use strict'

const { test, expect } = require('@playwright/test');
const { playwright } = require('test-util-ipfs-example');

// Setup
const play = test.extend({
  ...playwright.servers(),
});

play.describe('using script tag:', () => {
  // DOM
  const status = "#status"
  const node = "#node"

  play.beforeEach(async ({servers, page}) => {
    await page.goto(`http://localhost:${servers[0].port}/`);
  })

  play('should properly initialized a IPFS node and print the status', async ({ page }) => {
    await page.waitForSelector(status)
    expect(await page.textContent(status)).toContain("offline");

    expect(await page.textContent(node)).toContain("ID: ");
    expect(await page.textContent(status)).toContain("online");
  });
});
