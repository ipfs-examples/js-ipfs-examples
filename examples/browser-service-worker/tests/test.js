// @ts-check
import { test, expect } from '@playwright/test';
import { playwright } from 'test-util-ipfs-example';

// Setup
const play = test.extend({
  ...playwright.servers([], true),
});

/**
 * attempt to prevent net::ERR_ABORTED error
 */
play.setTimeout(120 * 1000)

play.describe('browser service worker:', () => {
  // DOM
  const linkDOM = "a"
  const textDOM = "body"
  const debugDOM = "#debug"

  play.beforeEach(async ({servers, page}) => {
    await page.goto(`http://localhost:${servers[0].port}/`);
  })

  play('should properly load the content of an IPFS hash', async ({ servers, page, context }) => {
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on("pageerror", (err) => {
      console.trace(`pageerror: ${err.message}`)
    })
    // await page.waitForSelector(textDOM)
    // await page.waitForSelector(linkDOM)

    expect(await page.textContent(textDOM)).toContain("Load content by adding IPFS path to the URL")
    expect(await page.textContent(linkDOM)).toContain("/ipfs/bafy")

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
    // await page.waitForSelector(`${debugDOM}:has-text("SW is ready")`, {
    //   state: 'attached'
    // })

    context.on('request', (request) => {
      console.log(`request.url(): ${request.url()}`)
    })
    context.on('requestfailed', (request) => {
      console.log(`context.requestfailed: ${request.url()}`)
      console.log(`context.requestfailed request?.failure()?.errorText: `, request?.failure()?.errorText);
    })
    page.on('requestfailed', (request) => {
      console.log(`page.requestfailed: ${request.url()}`)
      console.log(`page.requestfailed request?.failure()?.errorText: `, request?.failure()?.errorText);
    })
    const serviceWorkerResponsePromise = new Promise((resolve, reject) => {
      context.on('response', async (response) => {
        console.log(`context.response response.url(): ${response.url()}`)
        if (response.url() === ipfsRequestUrl && response.fromServiceWorker()) {
          resolve(response);
        }
      })
    })

    // const currentURL = await page.url();
    await page.goto(ipfsRequestUrl, {waitUntil: 'commit'});
    const serviceWorkerResponse = await serviceWorkerResponsePromise
    page.on('request', async (request) => {
      try {
        console.log(`page.request request.url(): ${request.url()}`)
        console.log(`page.request (await request.response())?.status(): ${(await request.response())?.status()}`)
        console.log(`page.request await (await request.response())?.text(): ${await (await request.response())?.text()}`)
        console.log(`request.serviceWorker(): `, request.serviceWorker());
      } catch {}
    });

    expect(await serviceWorkerResponse.status()).toBe(200)
    expect(await serviceWorkerResponse.text()).toContain("hello world")
    // await page.waitForSelector('#viewer', {state: 'visible'})

    // const frameText2 = page.frameLocator('#viewer').locator(textDOM)
    // // await frameText2.waitFor({state: 'visible'})

    // // loop over all of the frames and log their content
    // const frames = await page.frames();
    // for (const frame of frames) {
    //   console.log('page.frames textContent: ', await frame.textContent(textDOM));
    //   console.log('page.frames innerText: ', await frame.innerText(textDOM));
    // }

    // expect(await frameText2.textContent()).toContain("hello world")

    // const elementFrame = await page.waitForSelector("iframe")
    // /**
    //  * @type {import('playwright').Frame}
    //  */
    // // @ts-ignore
    // const frame = await elementFrame.contentFrame()
    // if (frame == null) {
    //   throw new Error('frame is null')
    // }
    // const frameText = await frame.textContent(textDOM)

    // expect(frameText).toContain("hello world")
  });

  play.afterAll(async ({servers}) => {
    // now stop all servers
    for (const server of servers) {
      await server.stop()
    }
  })
});
