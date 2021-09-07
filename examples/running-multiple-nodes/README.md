<p align="center">
  <a href="https://js.ipfs.io" title="JS IPFS">
    <img src="https://ipfs.io/ipfs/Qme6KJdKcp85TYbLxuLV7oQzMiLremD7HMoXLZEmgo6Rnh/js-ipfs-sticker.png" alt="IPFS in JavaScript logo" width="244" />
  </a>
</p>

<h3 align="center"><b>Multiple IPFS nodes</b></h3>

<p align="center">
  <b><i>Running multiple JS IPFS nodes</i></b>
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
  - [Via the CLI](#via-the-cli)
  - [Programmatically](#programmatically)
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

This example takes you through the process needed to run 2 or more JS IPFS nodes on the same computer.

### Via the CLI

Firstly, you'll want to use the `IPFS_PATH` env variable to get a different repo for each instance. Initialise a new IPFS repo like this:

```sh
# IPFS_PATH by default is `~/.jsipfs`.
# The following instructs JS IPFS to use the path `~/.jsipfs2` instead:
IPFS_PATH=~/.jsipfs2 jsipfs init

# Repeat this for as many nodes as you want to run...
```

Secondly, you'll need them to bind to different ports because otherwise bad things happen.

With the CLI, after you've run `ipfs init` you can either edit the config file at `~/.jsipfs/config` (replacing `~/.jsipfs` with the repo path you specified above) or use the config command to update the config e.g. `ipfs config Addresses.API /ip4/0.0.0.0/tcp/4012`. Then start the node with `ipfs daemon`:

```sh
# edit the address ports
vi ~/.jsipfs2/config

# OR

IPFS_PATH=~/.jsipfs2 jsipfs config Addresses.API /ip4/127.0.0.1/tcp/5012

# Repeat this for as many nodes as you want to run...
```

```sh
# ...and then start the daemon
IPFS_PATH=~/.jsipfs2 jsipfs daemon

# Repeat this for as many nodes as you want to run...
```

### Programmatically

Firstly, you'll want to pass the [`repo`](https://github.com/ipfs/js-ipfs#optionsrepo) option to the constructor to get a different repo for each instance:

```js
// The repo path by default is `os.homedir() + '/.jsipfs'`.
await IPFS.create({ repo: os.homedir() + "/.jsipfs2" });
```

Secondly, you'll need them to bind to different ports because otherwise bad things happen.

To do this, simply pass the different ports to the [`config`](https://github.com/ipfs/js-ipfs#optionsconfig) constructor option. All together:

```js
await IPFS.create({
  repo: os.homedir() + "/.jsipfs2",
  config: {
    Addresses: {
      Swarm: ["/ip4/0.0.0.0/tcp/4012", "/ip4/127.0.0.1/tcp/4013/ws"],
      API: "/ip4/127.0.0.1/tcp/5012",
      Gateway: "/ip4/127.0.0.1/tcp/9191",
      RPC: "/ip4/127.0.0.1/tcp/4839",
    },
  },
});
```

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
