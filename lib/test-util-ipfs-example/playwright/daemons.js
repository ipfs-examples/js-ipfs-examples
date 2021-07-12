const { createFactory } = require('ipfsd-ctl')

const daemons = (factoryOptions, factoryOverrideOptions, spawnOptions) => {
  return {
    // "server" fixture starts automatically for every worker - we pass "auto" for that.
    daemons: async ({}, use) => {
      console.log("Creating ipfs daemons...")
      const daemons = [];

      for (const spawnOption of spawnOptions) {
        const df = createFactory(factoryOptions, factoryOverrideOptions)
        const daemon = await df.spawn(spawnOption)

        console.log(`Created daemon for ${daemon.apiAddr.toString()}`)
        daemons.push(daemon)
      }

      // Use the server in the tests.
      await use(daemons);

      // Cleanup.
      await new Promise(done => {
        Promise.all(daemons.map(daemon => daemon.stop())).then(() => done());
      });
    }
  }
}

module.exports = daemons;
