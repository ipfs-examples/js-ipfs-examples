import { test, expect } from '@playwright/test';
import { playwright } from 'test-util-ipfs-example';
import fs from 'fs';

// Setup
const play = test.extend({
  ...playwright.servers(),
});

play.describe('video readable stream:', () => {
  // DOM
  const output = "#output"
  const container = "#container"
  const cid = "#cid"
  const goBtn = "#gobutton"

  play.beforeEach(async ({servers, page}) => {
    await page.goto(`http://localhost:${servers[0].port}/`);
  })

  play('should properly initialized a IPFS node and play an uploaded .mp4', async ({ page }) => {
    await page.textContent('#output:has-text("IPFS: Ready")')
    await page.waitForSelector(container);
    const buffer = fs.readFileSync(`${__dirname}/test.mp4`)

    await page.evaluateHandle(([el, buffer]) => {
      function toArrayBuffer(buf) {
        var ab = new ArrayBuffer(buf.length);
        var view = new Uint8Array(ab);
        for (var i = 0; i < buf.length; ++i) {
            view[i] = buf[i];
        }
        return view;
      }

      const container = document.querySelector(el)
      const contentFile = toArrayBuffer(buffer)

      // fake dropping a file
      container.ondrop({
        preventDefault: () => {},
        dataTransfer: {
          items: [{
            kind: 'file',
            type: "video/mp4",
            getAsFile: () => {
              return new File ([contentFile], 'test.mp4', {
                type: "video/mp4"
              })
            }
          }]
        }
      })
    }, [container, [...buffer]])

    const cidValue = "QmNWXpwJ7mdDeGoDuWo9Axhi2cbhxLm3ateiCY1fvPjaiz"
    await page.waitForSelector(`${output}:has-text('${cidValue}')`)

    expect(await page.$eval(cid, el => el.value)).toBe(cidValue)
    await page.click(goBtn)

    await page.waitForSelector(`${output}:has-text('Playing ${cidValue}')`)
  });
});
