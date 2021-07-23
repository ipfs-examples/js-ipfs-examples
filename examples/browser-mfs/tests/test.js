'use strict'

const { test, expect } = require('@playwright/test');
const { playwright } = require('test-util-ipfs-example');

// Setup
const play = test.extend({
  ...playwright.servers(),
});

play.describe('mutable file system:', () => {
  // DOM
  const modalScreen = "#modal-screen"
  const log = "#log"
  const files = "#files"

  const btnMkdir = "#button-mkdir"
  const inputMkdirPath = "#form-mkdir-path"
  const btnMkdirFormSubmit = "#button-form-mkdir-submit"

  const btnCp = "#button-cp"
  const inputCpPath = "#form-cp-path"
  const inputCpDest = "#form-cp-dest"
  const btnCpFormSubmit = "#button-form-cp-submit"

  const btnMv = "#button-mv"
  const inputMvPath = "#form-mv-path"
  const inputMvDest = "#form-mv-dest"
  const btnMvFormSubmit = "#button-form-mv-submit"

  const btnRm = "#button-rm"
  const inputRmPath = "#form-rm-path"
  const btnRmFormSubmit = "#button-form-rm-submit"

  play.beforeEach(async ({servers, page}) => {
    await page.goto(`http://localhost:${servers[0].port}/`);
  })

  play('should properly make, copy, move and delete files using MFS', async ({ page }) => {
    await page.isHidden(modalScreen)
    await page.waitForSelector(log + '  > *')

    expect(await page.textContent(log)).toContain('IPFS: Drop some files into this window to get started')

    await page.click(btnMkdir)
    await page.waitForSelector(inputMkdirPath)
    await page.fill(inputMkdirPath, '/folder')
    await page.click(btnMkdirFormSubmit)

    await page.waitForSelector(':has-text("folder/")');

    await page.click(btnCp)
    await page.waitForSelector(inputCpPath)
    await page.waitForSelector(inputCpDest)
    await page.fill(inputCpPath, '/folder')
    await page.fill(inputCpDest, '/folder-copy')
    await page.click(btnCpFormSubmit)

    await page.waitForSelector(':has-text("folder-copy/")');

    await page.click(btnMv)
    await page.waitForSelector(inputMvPath)
    await page.waitForSelector(inputMvDest)
    await page.fill(inputMvPath, '/folder')
    await page.fill(inputMvDest, '/folder-other')
    await page.click(btnMvFormSubmit)

    await page.waitForSelector(':has-text("folder/")', { state: 'detached' });

    let filesTextContent = await page.textContent(files)
    expect(filesTextContent).not.toContain('folder/')
    expect(filesTextContent).toContain('folder-copy/')

    await page.click(btnRm)
    await page.waitForSelector(inputRmPath)
    await page.fill(inputRmPath, '/folder-copy')
    await page.click(btnRmFormSubmit)

    await page.waitForSelector(':has-text("folder-copy/")', { state: 'detached' });

    filesTextContent = await page.textContent(files)
    expect(filesTextContent).not.toContain('folder-copy/')
    expect(filesTextContent).toContain('folder-other/')
  });
});
