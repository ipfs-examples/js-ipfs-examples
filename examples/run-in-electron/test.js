"use strict";

const { node } = require("test-util-ipfs-example");
const path = require("path");

async function test() {
  await node.waitForOutput("protocolVersion", "electron", [
    path.resolve(`${__dirname}/main.js`)
  ]);
}

test();
