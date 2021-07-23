const sirv = require('sirv')
const polka = require('polka')
const stoppable = require('stoppable')

const servers = (serverConfiguration = []) => {
  return {
    // We pass a tuple to specify fixtures options.
    // In this case, we mark this fixture as worker-scoped.
    servers: [ async ({}, use, workerInfo) => {
      let promiseServers = [];
      const servers = [];
      const configurations = [...serverConfiguration]

      if (configurations.length === 0) {
        configurations.push({
          portToUse: 3000,
          folderToServe: 'dist'
        })
      }

      for (const configuration of configurations) {
        // "port" fixture uses a unique value of the worker process index.
        const port = configuration.portToUse + workerInfo.workerIndex;

        // Setup polka app.
        const static = sirv(configuration.folderToServe, {
          maxAge: 31536000, // 1Y
          immutable: true
        });

        console.log('Starting server...');

        const app = polka();

        promiseServers.push(new Promise((resolve, reject) => {
          app
            .use(static)
            .listen(port, err => {
              if (err) throw err;

              servers.push({
                server: stoppable(app.server),
                port: port
              })
              console.log(`> Ready on localhost:${port}!`);

              resolve();
            });
        }))
      }

      await Promise.all(promiseServers)

      // Use the server in the tests.
      await use(servers);


      // Cleanup.
      console.log('Stopping servers...');
      promiseServers = servers.map(m => new Promise(f => m.server.close(f)));

      await Promise.all(promiseServers)
      console.log('Servers stopped');
    }, { scope: 'worker', auto: true } ],
  }
}

module.exports = servers;
