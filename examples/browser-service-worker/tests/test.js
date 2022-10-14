// @ts-check
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

  play.beforeEach(async ({servers, page}) => {
    await page.goto(`http://localhost:${servers[0].port}/`);
  })

  play('should properly load the content of an IPFS hash', async ({ servers, page, context }) => {
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on("pageerror", (err) => {
      console.trace(`pageerror: ${err.message}`)
    })

    expect(await page.textContent(textDOM)).toContain("Load content by adding IPFS path to the URL")
    expect(await page.textContent(linkDOM)).toContain("/ipfs/bafy")

    /**
     * Request /view path directly, as this is still handled by the service worker but doesn't break tests in github CI.
     * @see https://github.com/ipfs-examples/js-ipfs-examples/blob/master/examples/browser-service-worker/src/service.js#L48-L52
     * @see https://github.com/ipfs-examples/js-ipfs-examples/pull/527
     */
    const ipfsRequestUrl = `http://localhost:${servers[0].port}/view/ipfs/Qmf412jQZiuVUtdgnB36FXFX7xg5V6KEbSJ4dpQuhkLyfD`

    /**
     * Wait for the service worker to be ready
     * @see https://playwright.dev/docs/service-workers-experimental#accessing-service-workers-and-waiting-for-activation
     */
    await page.evaluate(async () => {
      const registration = await window.navigator.serviceWorker.getRegistration();
      if (registration?.active?.state === 'activated') {
        console.log('Service worker is already activated')
        return;
      }
      await /** @type {Promise<void>} */(new Promise(res => {
        window.navigator.serviceWorker.addEventListener('controllerchange', () => {
          console.log('Service worker is activated')
          res()
        })
      }));
    });

    const serviceWorkerResponsePromise = new Promise((resolve) => {
      context.on('response', async (response) => {
        if (response.url() === ipfsRequestUrl && response.fromServiceWorker()) {
          resolve(response);
        }
      })
    })

    await page.goto(ipfsRequestUrl, {waitUntil: 'commit'});
    const serviceWorkerResponse = await serviceWorkerResponsePromise

    expect(await serviceWorkerResponse.status()).toBe(200)
    expect(await serviceWorkerResponse.text()).toContain("hello world")
  });
});
