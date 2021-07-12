'use strict'

const { test, expect } = require('@playwright/test');

test.describe('Add readable stream example', () => {
  test('should properly initialized a IPFS node and print the Id', async ({ page }) => {
    const outputSelector = "#output"

    await page.goto('http://localhost:1234/');
    await page.waitForSelector(outputSelector)

    expect(await page.textContent(outputSelector)).toContain("directory/ QmVgJePRxp1vhRxDcJWdmuFGfUB5S5RYTtG1NR3bQM4BBn");
  });
});
