"use strict";

const fs = require('fs-extra')
const execa = require('execa')
const which = require('which')

async function isExecutable(command) {
  try {
    await fs.access(command, fs.constants.X_OK, () => {});

    return true;
  } catch (err) {
    if (err.code === "ENOENT") {
      return await isExecutable(await which(command));
    }

    if (err.code === "EACCES") {
      return false;
    }

    throw err;
  }
}

async function execaUtil(command, args = [], opts = {}, callback = null) {
  if (!(await isExecutable(command))) {
    args.unshift(command);
    command = "node";
  }

  const proc = execa(command, args, { ...opts, all: true });

  if (callback) {
    callback(proc)
  }

  return proc
}

module.exports = execaUtil;
