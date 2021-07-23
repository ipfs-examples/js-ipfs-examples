'use strict'

const { test, expect } = require('@playwright/test');
const { playwright } = require('test-util-ipfs-example');

// Setup
const play = test.extend({
  ...playwright.servers(),
});

play.describe('add readable stream:', () => {
  // DOM
  const fileDirectoryInput = "#file-directory"
  const fileNameInput = "#file-name"
  const fileContentInput = "#file-content"
  const addFileBtn = "#add-submit"

  const output = "#output"

  play.beforeEach(async ({servers, page}) => {
    await page.goto(`http://localhost:${servers[0].port}/`);
  })

  play('should properly initialized a IPFS node and add files using a readable stream', async ({ page }) => {
    const fileName = 'test.txt'
    const fileContent = 'This is a test sample!'

    await page.fill(fileDirectoryInput, 'directory')
    await page.fill(fileNameInput, fileName)
    await page.fill(fileContentInput, fileContent)

    await page.click(addFileBtn)

    await page.waitForSelector(`${output}:has-text('Done!')`);

    expect(await page.textContent(output)).toContain("directory");
    expect(await page.textContent(output)).toContain(fileName);
    expect(await page.textContent(output)).toContain(fileContent);
    expect(await page.textContent(output)).toContain("QmTZ9ZptBBbjzT6kJcHvPJQRoY2oPWYdishpeYqsCSiKXM");
    expect(await page.textContent(output)).toContain("https://ipfs.io/ipfs/QmTZ9ZptBBbjzT6kJcHvPJQRoY2oPWYdishpeYqsCSiKXM/test.txt");
  });
});
