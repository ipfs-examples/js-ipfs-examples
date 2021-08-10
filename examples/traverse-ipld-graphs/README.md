<p align="center">
  <a href="https://js.ipfs.io" title="JS IPFS">
    <img src="https://ipfs.io/ipfs/Qme6KJdKcp85TYbLxuLV7oQzMiLremD7HMoXLZEmgo6Rnh/js-ipfs-sticker.png" alt="IPFS in JavaScript logo" width="244" />
  </a>
</p>

<h3 align="center"><b>Traverse IPLD graphs</b></h3>

<p align="center">
  <b><i>Resolve through IPLD graphs with the dag API</i></b>
  <br />
  <br />
  <img src="https://raw.githubusercontent.com/jlord/forkngo/gh-pages/badges/cobalt.png" width="200">
  <br>
  <a href="https://github.com/ipfs/js-ipfs/tree/master/docs">Explore the docs</a>
  ·
  <a href="https://github.com/ipfs-examples/js-ipfs-examples/issues">Report Bug</a>
  ·
  <a href="https://github.com/ipfs-examples/js-ipfs-examples/issues">Request Feature/Example</a>
</p>

## Table of Contents

- [Table of Contents](#table-of-contents)
- [About The Project](#about-the-project)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation and Running example](#installation-and-running-example)
- [Usage](#usage)
  - [IPLD Formats](#ipld-formats)
  - [create nodes to build a graph](#create-nodes-to-build-a-graph)
  - [retrieve a node from a graph](#retrieve-a-node-from-a-graph)
  - [resolve a path in a graph](#resolve-a-path-in-a-graph)
  - [resolve through graphs of different kind](#resolve-through-graphs-of-different-kind)
- [traverse through a slice of the ethereum blockchain](#traverse-through-a-slice-of-the-ethereum-blockchain)
- [traverse through a git repo](#traverse-through-a-git-repo)
  - [Video of the demos](#video-of-the-demos)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [Want to hack on IPFS?](#want-to-hack-on-ipfs)

## About The Project

- Read the [docs](https://github.com/ipfs/js-ipfs/tree/master/docs)
- Look into other [examples](https://github.com/ipfs-examples/js-ipfs-examples) to learn how to spawn an IPFS node in Node.js and in the Browser
- Consult the [Core API docs](https://github.com/ipfs/js-ipfs/tree/master/docs/core-api) to see what you can do with an IPFS node
- Visit https://dweb-primer.ipfs.io to learn about IPFS and the concepts that underpin it
- Head over to https://proto.school to take interactive tutorials that cover core IPFS APIs
- Check out https://docs.ipfs.io for tips, how-tos and more
- See https://blog.ipfs.io for news and more
- Need help? Please ask 'How do I?' questions on https://discuss.ipfs.io

## Getting Started

### Prerequisites

Make sure you have installed all of the following prerequisites on your development machine:

- Git - [Download & Install Git](https://git-scm.com/downloads). OSX and Linux machines typically have this already installed.
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

### Installation and Running example

```console
> npm install
> npm start
```

## Usage

IPLD stands for [`InterPlanetary Linked-Data`](https://ipld.io/), it is the data model of the content-addressable web. It gives IPFS the ability to resolve through any kind of content-addressed graph, as long as the [adapter for the format is available](https://github.com/ipld/interface-ipld-format#modules-that-implement-the-interface).

This tutorial goes through several operations over IPLD graphs using the [DAG API](https://github.com/ipfs/js-ipfs/tree/master/packages/interface-ipfs-core/API/dag).

### IPLD Formats

[IPLD](https://docs.ipld.io/) can read many datatypes, all of which are represented as blocks in the blockstore of your IPFS node. In order to turn a block into a data structure it can use, IPLD uses different codecs to turn `Uint8Arrays` into JavaScript objects and back.

By default IPFS is bundled with [dag-pb](https://www.npmjs.com/package/ipld-dag-pb), [dag-cbor](https://www.npmjs.com/package/ipld-dag-cbor) and [raw](https://www.npmjs.com/package/ipld-raw) codecs which allow reading UnixFS files and JavaScript objects from the blockstore.

To configure other types, we must pass the `ipld.formats` option to the `IPFS.create()` function:

```javascript
const IPFS = require("ipfs");

const node = await IPFS.create({
  ipld: {
    formats: [
      require("ipld-git"),
      require("ipld-zcash"),
      require("ipld-bitcoin"),
      ...Object.values(require("ipld-ethereum")), // this format exports multiple codecs so flatten into a list
      // etc, etc
    ],
  },
});
```

See [ipld/interface-ipld-format](https://github.com/ipld/interface-ipld-format) for a list of modules that implement the `ipld-format` interface.

### [create nodes to build a graph](./put.js)

### [retrieve a node from a graph](./get.js)

### [resolve a path in a graph](./get-path.js)

### [resolve through graphs of different kind](./get-path-accross-formats.js)

## [traverse through a slice of the ethereum blockchain](./eth.js)

## [traverse through a git repo](./git.js)

The example objects contained in "git-objects" have already been decompressed with zlib. An example of how to do this:

    $ cat .git/objects/7d/df25817f57c2090a9568cdb17106a76dad7d04 | zlib-flate -uncompress > 7ddf25817f57c2090a9568cdb17106a76dad7d04

### Video of the demos

Find a video with a walkthrough of this examples on Youtube:

[![](https://ipfs.io/ipfs/QmYkeiPtVTR8TdgBNa4u46RvjfnbUFUxSDdb8BqDpqDEer)](https://youtu.be/drULwJ_ZDRQ?t=1m29s)

_For more examples, please refer to the [Documentation](#documentation)_

## Documentation

- [Config](https://docs.ipfs.io/)
- [Core API](https://github.com/ipfs/js-ipfs/tree/master/docs/core-api)
- [Examples](https://github.com/ipfs-examples/js-ipfs-examples)
- [Development](https://github.com/ipfs/js-ipfs/blob/master/docs/DEVELOPMENT.md)
- [Tutorials](https://proto.school)

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the IPFS Project
2. Create your Feature Branch (`git checkout -b feature/amazing-feature`)
3. Commit your Changes (`git commit -a -m 'feat: add some amazing feature'`)
4. Push to the Branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Want to hack on IPFS?

[![](https://cdn.rawgit.com/jbenet/contribute-ipfs-gif/master/img/contribute.gif)](https://github.com/ipfs/community/blob/master/CONTRIBUTING.md)

The IPFS implementation in JavaScript needs your help! There are a few things you can do right now to help out:

Read the [Code of Conduct](https://github.com/ipfs/community/blob/master/code-of-conduct.md) and [JavaScript Contributing Guidelines](https://github.com/ipfs/community/blob/master/CONTRIBUTING_JS.md).

- **Check out existing issues** The [issue list](https://github.com/ipfs/js-ipfs/issues) has many that are marked as ['help wanted'](https://github.com/ipfs/js-ipfs/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc+label%3A%22help+wanted%22) or ['difficulty:easy'](https://github.com/ipfs/js-ipfs/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc+label%3Adifficulty%3Aeasy) which make great starting points for development, many of which can be tackled with no prior IPFS knowledge
- **Look at the [IPFS Roadmap](https://github.com/ipfs/roadmap)** This are the high priority items being worked on right now
- **Perform code reviews** More eyes will help
  a. speed the project along
  b. ensure quality, and
  c. reduce possible future bugs.
- **Add tests**. There can never be enough tests.
- **Join the [Weekly Core Implementations Call](https://github.com/ipfs/team-mgmt/issues/992)** it's where everyone discusses what's going on with IPFS and what's next
