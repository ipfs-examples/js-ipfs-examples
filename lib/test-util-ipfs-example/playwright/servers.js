import sirv from 'sirv'
import polka from 'polka'
import stoppable from 'stoppable'

/**
 * @template T
 * @template W
 * @template PT
 * @template PW
 * @return {import('@playwright/test').Fixtures<T, W, PT, PW>}
 */
const servers = (serverConfiguration = [], explicitStop = false) => {
  return {
    // We pass a tuple to specify fixtures options.
    // In this case, we mark this fixture as worker-scoped.
    servers: [ async ({}, use, workerInfo) => {
      const promiseServers = [];
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
        const staticFiles = sirv(configuration.folderToServe, {
          maxAge: 31536000, // 1Y
          immutable: true
        });

        console.log('Starting server...');

        const app = polka();

        promiseServers.push(/** @type {Promise<void>} */(new Promise((resolve, reject) => {
          app
            .use(staticFiles)
            .listen(port, err => {
              if (err) throw err;

              const server = stoppable(app.server)
              servers.push({
                server,
                port: port,
                stop: async () => {
                  console.log(`Stopping server on port ${port}...`)
                  await new Promise(r => server.stop(r))
                  console.log(`Server on port ${port} stopped`)
                }
              })
              console.log(`> Ready on localhost:${port}!`);

              resolve();
            });
        })))
      }

      await Promise.all(promiseServers)

      // Use the server in the tests.
      await use(servers)

      if (!explicitStop) {
        // Cleanup.
        console.log('Stopping servers...');

        await Promise.all(servers.map(s => s.stop()))
        console.log('Servers stopped');
      }
    }, { scope: 'worker', auto: true } ],
  }
}

export default servers;
