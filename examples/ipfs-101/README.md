<p align="center">
  <a href="https://js.ipfs.io" title="JS IPFS">
    <img src="https://ipfs.io/ipfs/Qme6KJdKcp85TYbLxuLV7oQzMiLremD7HMoXLZEmgo6Rnh/js-ipfs-sticker.png" alt="IPFS in JavaScript logo" width="244" />
  </a>
</p>

<h3 align="center"><b>Tutorial 101</b></h3>

<p align="center">
  <b><i>Demo of "Using go-ipfs as a library" with js-ipfs</i></b>
  <br />
  <br />
  <img src="https://raw.githubusercontent.com/jlord/forkngo/gh-pages/badges/cobalt.png" width="200">
  <br>
  <a href="https://github.com/ipfs/js-ipfs/tree/master/docs">Explore the docs</a>
  ·
  <a href="https://codesandbox.io/">View Demo</a>
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
  - [Code analysis](#code-analysis)
- [References](#references)
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

This tutorial is the sibling of the [go-ipfs "Using go-ipfs as a library" tutorial](https://github.com/ipfs/go-ipfs/tree/master/docs/examples/go-ipfs-as-a-library).

In this tutorial, we go through spawning an IPFS node, adding a file and cat'ing the file multihash locally and through the gateway.

You can find a complete version of this tutorial in [1.js](./1.js). For this tutorial, you need to install `ipfs` using `npm install ipfs`.

### Code analysis

Creating an IPFS instance can be done in one line, after requiring the module, you simply have to:

```js
import * as IPFS from 'ipfs-core';

async function main() {
  const node = await IPFS.create();
  // ...
}

main();
```

As a test, we are going to check the version of the node.

```js
import * as IPFS from 'ipfs-core';

async function main() {
  const node = await IPFS.create();
  const version = await node.version();

  console.log("Version:", version.version);
  // ...
}

main();
```

(If you prefer not to use `async`/`await`, you can instead use `.then()` as you would with any promise, or pass an [error-first callback](https://nodejs.org/api/errors.html#errors_error_first_callbacks), e.g. `node.version((err, version) => { ... })`)

Running the code above gets you:

```bash
> node 1.js
Version: 0.31.2
```

Now let's make it more interesting and add a file to IPFS using `node.add`. A file consists of a path and content.

You can learn about the IPFS File API at [interface-ipfs-core](https://github.com/ipfs/js-ipfs/blob/master/docs/core-api/FILES.md).

```js
import * as IPFS from 'ipfs-core';

async function main() {
  const node = await IPFS.create();
  const version = await node.version();

  console.log("Version:", version.version);

  const fileAdded = await node.add({
    path: "hello.txt",
    content: "Hello World 101",
  });

  console.log("Added file:", fileAdded.path, fileAdded.cid);
  // ...
}

main();
```

You can now go to an IPFS Gateway and load the printed hash from a gateway. Go ahead and try it!

```bash
> node 1.js
Version: 0.31.2

Added file: hello.txt QmXgZAUWd8yo4tvjBETqzUy3wLx5YRzuDwUQnBwRGrAmAo
# Copy that hash and load it on the gateway, here is a prefiled url:
# https://ipfs.io/ipfs/QmXgZAUWd8yo4tvjBETqzUy3wLx5YRzuDwUQnBwRGrAmAo
```

The last step of this tutorial is retrieving the file back using the `cat` 😺 call.

```js
import * as IPFS from 'ipfs-core';

async function main() {
  const node = await IPFS.create();
  const version = await node.version();

  console.log("Version:", version.version);

  const fileAdded = await node.add({
    path: "hello.txt",
    content: "Hello World 101",
  });

  console.log("Added file:", fileAdded.path, fileAdded.cid);

  const chunks = [];
  for await (const chunk of node.cat(fileAdded.cid)) {
    chunks.push(chunk);
  }

  console.log("Added file contents:", uint8ArrayConcat(chunks).toString());
}

main();
```

That's it! You just added and retrieved a file from the Distributed Web!

_For more examples, please refer to the [Documentation](#documentation)_

## References

- Documentation:
  - [IPFS CONFIG](https://github.com/ipfs/js-ipfs/blob/master/docs/CONFIG.md)
  - [MISCELLANEOUS](https://github.com/ipfs/js-ipfs/blob/master/docs/core-api/MISCELLANEOUS.md)
  - [FILES](https://github.com/ipfs/js-ipfs/blob/master/docs/core-api/FILES.md)
- Tutorials:
  - [MFS API](https://proto.school/mutable-file-system)
  - [Regular File API](https://proto.school/regular-files-api)

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
