import execaUtil from './execa.js'
import { toString as uint8ArrayToString } from 'uint8arrays/to-string'

async function waitForOutput(expectedOutput, command, args = [], opts = {}) {
  const proc = execaUtil(command, args, { ...opts, all: true }, (exec) => {
    exec.all.on('data', (data) => {
      process.stdout.write(data)
      output += uint8ArrayToString(data)

      if (output.includes(expectedOutput)) {
        foundExpectedOutput = true;
        exec.kill();
        cancelTimeout();
      }
    });
  })

  let output = "";
  const time = 120000;

  let foundExpectedOutput = false;
  let cancelTimeout;
  const timeoutPromise = new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(
        new Error(
          `Did not see "${expectedOutput}" in output from "${[command]
            .concat(args)
            .join(" ")}" after ${time / 1000}s`
        )
      );

      setTimeout(() => {
        proc.kill();
      }, 100);
    }, time);

    cancelTimeout = () => {
      clearTimeout(timeout);
      resolve();
    };
  });

  try {
    await Promise.race([proc, timeoutPromise]);
  } catch (err) {
    if (!err.killed) {
      throw err;
    }
  }

  if (!foundExpectedOutput) {
    throw new Error(
      `Did not see "${expectedOutput}" in output from "${[command]
        .concat(args)
        .join(" ")}"`
    );
  }
}

export default waitForOutput
