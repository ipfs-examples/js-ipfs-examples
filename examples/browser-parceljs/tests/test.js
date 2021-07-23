'use strict'

const { test, expect } = require('@playwright/test');
const { playwright } = require('test-util-ipfs-example');

// Setup
const play = test.extend({
  ...playwright.servers(),
});

play.describe('bundle ipfs with parceljs:', () => {
  // DOM
  const nameInput = "#file-name"
  const contentInput = "#file-content"
  const submitBtn = "#add-submit"
  const output = "#output"

  play.beforeEach(async ({servers, page}) => {
    await page.goto(`http://localhost:${servers[0].port}/`);
  })

  play('should properly initialized a IPFS node and add/get a file', async ({ page }) => {
    const fileName = 'test.txt'
    const stringToUse = 'Hello world!'

    await page.fill(nameInput, fileName)
    await page.fill(contentInput, stringToUse)
    await page.click(submitBtn)

    await page.waitForSelector(`${output}:has-text("/QmQzCQn4puG4qu8PVysxZmscmQ5vT1ZXpqo7f58Uh9QfyY")`)

    const outputContent = await page.textContent(output)

    expect(outputContent).toContain("QmQzCQn4puG4qu8PVysxZmscmQ5vT1ZXpqo7f58Uh9QfyY");
    expect(outputContent).toContain("https://ipfs.io/ipfs/QmQzCQn4puG4qu8PVysxZmscmQ5vT1ZXpqo7f58Uh9QfyY");
    expect(outputContent).toContain(fileName);
    expect(outputContent).toContain(stringToUse);
  });
});
