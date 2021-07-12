const { test, expect } = require('@playwright/test');

test('add readable stream', async ({ page }) => {
  // Go to http://localhost:1234/
  await page.goto('http://localhost:1234/');

  // Check examples
  await page.isVisible('#examples details:nth-child(1)');
  await page.isVisible('#examples details:nth-child(2)');
  await page.isVisible('#examples details:nth-child(3)');

  expect(await page.textContent('#output')).toBe("");

  // Click [placeholder="file.txt"]
  await page.click('[placeholder="file.txt"]');

  // Fill [placeholder="file.txt"]
  await page.fill('[placeholder="file.txt"]', 'file.txt');

  // Press Tab
  await page.press('[placeholder="file.txt"]', 'Tab');

  // Fill [placeholder="Hello world"]
  const text = "Test Hello world :)"
  await page.fill('[placeholder="Hello world"]', text);

  // Click text=Add files
  await page.click('text=Add files');

  expect(await page.textContent('#output')).not.toBe("");

  // Check preview
  await page.isVisible('#content details:nth-child(1)');
  expect(await page.textContent('#content details:nth-child(1)')).toContain(text)

  await page.isVisible('#content details:nth-child(2)');
  await page.isVisible('#content details:nth-child(3)');
  await page.isVisible('#content details:nth-child(4)');
});
