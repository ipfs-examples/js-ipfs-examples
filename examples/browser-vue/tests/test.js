import { test, expect } from '@playwright/test';
import { playwright } from 'test-util-ipfs-example';

// Setup
const play = test.extend({
  ...playwright.servers(),
});

play.describe('integrate ipfs with vue:', () => {
  // DOM
  const info = ".ipfs-info"
  const id = "#ipfs-info-id"
  const agent = "#ipfs-info-agent"

  play.beforeEach(async ({servers, page}) => {
    await page.goto(`http://localhost:${servers[0].port}/`);
  })

  play('should properly initialized a IPFS node and print some information about the node', async ({ page }) => {
    await page.waitForSelector(info)

    expect(await page.textContent(id)).not.toBe("")
    expect(await page.textContent(agent)).toContain("js-ipfs/");
  });
});
