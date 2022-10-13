import { test, expect } from '@playwright/test';
import { playwright } from 'test-util-ipfs-example';

// Setup
const play = test.extend({
  ...playwright.servers(),
});

play.describe('browser service worker:', () => {
  // DOM
  const linkDOM = "a"
  const textDOM = "body"
  const debugDOM = "#debug"

  // play.beforeEach(async ({servers, page}) => {
  //   await page.goto(`http://localhost:${servers[0].port}/`);
  // })

  play('should properly load the content of an IPFS hash', async ({ servers, page }) => {
    const currentURL = `http://localhost:${servers[0].port}/`
    await page.goto(currentURL);
    await page.waitForSelector(textDOM)
    await page.waitForSelector(linkDOM)

    expect(await page.textContent(textDOM)).toContain("Load content by adding IPFS path to the URL")
    expect(await page.textContent(linkDOM)).toContain("/ipfs/bafy")

    await page.waitForSelector(`${debugDOM}:has-text("SW is ready")`, {
      state: 'attached'
    })

    // const currentURL = await page.url();
    await page.goto(`${currentURL}ipfs/Qmf412jQZiuVUtdgnB36FXFX7xg5V6KEbSJ4dpQuhkLyfD`);
    await page.waitForSelector(textDOM)

    const elementFrame = await page.waitForSelector("iframe")
    const frame = await elementFrame.contentFrame()

    expect(await frame.textContent('pre')).toContain("hello world")
  });
});
