"use strict";

import { node } from "test-util-ipfs-example";
import path from "path"
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function test() {
  await node.waitForOutput("protocolVersion", "electron", [
    path.resolve(`${__dirname}/main.js`)
  ]);
}

test();
