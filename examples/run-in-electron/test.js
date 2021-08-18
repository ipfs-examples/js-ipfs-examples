const { _electron: electron } = require("playwright");

(async () => {
  // Launch Electron app.
  const electronApp = await electron.launch({ args: [`${__dirname}/main.js`] });

  // Get the first window that the app opens, wait if necessary.
  const window = await electronApp.firstWindow();

  await window.waitForTimeout(5000);

  const content = await window.textContent("#node");

  if (content.trim() === "") {
    throw new Error("It should have been created an IPFS node");
  }

  // Exit app.
  await electronApp.close();
})();
