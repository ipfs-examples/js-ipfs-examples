const { test, expect } = require('@playwright/test');
const { playwright } = require('test-util-ipfs-example');

// Setup
const play = test.extend({
  ...playwright.servers(),
});

play.describe('integrate ipfs with lit:', () => {
  // DOM
  const title = "[data-test=title]"
  const id = "[data-test=Id]"
  const agentVersion = "[data-test=AgentVersion]"
  const version = "[data-test=Version]"

  play.beforeEach(async ({servers, page}) => {
    await page.goto(`http://localhost:${servers[0].port}/`);
  })

  play('should properly initialized a IPFS node and print some properties', async ({ page }) => {
    await page.waitForSelector(title)

    expect(await page.textContent(title)).toContain("Connected to IPFS");
    expect(await page.isVisible(id)).toBeTruthy();
    expect(await page.isVisible(agentVersion)).toBeTruthy();
    expect(await page.isVisible(version)).toBeTruthy();
  });
});
