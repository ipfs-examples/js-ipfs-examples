<p align="center">
  <a href="https://js.ipfs.io" title="JS IPFS">
    <img src="https://ipfs.io/ipfs/Qme6KJdKcp85TYbLxuLV7oQzMiLremD7HMoXLZEmgo6Rnh/js-ipfs-sticker.png" alt="IPFS in JavaScript logo" width="244" />
  </a>
</p>

<h3 align="center"><b>Pubsub in the browser</b></h3>

<p align="center">
  <b><i>How to use pubsub in the browser!</i></b>
  <br />
  <br />
  <img src="https://raw.githubusercontent.com/jlord/forkngo/gh-pages/badges/cobalt.png" width="200">
  <br>
  <a href="https://github.com/ipfs/js-ipfs/tree/master/docs">Explore the docs</a>
  ·
  <a href="https://githubbox.com/ipfs-examples/js-ipfs-examples/tree/master/examples/http-client-browser-pubsub">View Demo</a>
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
  - [1. Start two IPFS nodes](#1-start-two-ipfs-nodes)
  - [2. Start the IPFS nodes](#2-start-the-ipfs-nodes)
    - [JS IPFS node](#js-ipfs-node)
    - [GO IPFS node](#go-ipfs-node)
  - [3. Open two browsers and connect to each node](#3-open-two-browsers-and-connect-to-each-node)
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
- IPFS Daemon - [Install js-ipfs](https://github.com/ipfs/js-ipfs) and [Download & Install IPFS Desktop](https://docs.ipfs.io/install/ipfs-desktop/) that will run the go version of IPFS or head over to https://dist.ipfs.io/#go-ipfs and hit the "Download go-ipfs" button. Extract the archive and read the instructions to install.

### Installation and Running example

With Node.js and git installed, install the project dependencies:

```console
$ npm install
```

Start the example application:

```sh
npm start
```

You should see something similar to the following in your terminal and the web app should now be available if you navigate to http://127.0.0.1:8888 using your browser.

## Usage

This example is a demo web application that allows you to connect to an IPFS node, subscribe to a pubsub topic and send/receive messages. We'll start two IPFS nodes and two browsers and use the `ipfs-http-client` to instruct each node to listen to a pubsub topic and send/receive pubsub messages to/from each other. We're aiming for something like this:

```
   +-----------+                   +-----------+
   |           +------------------->           |
   |  js-ipfs  |      pubsub       |  go-ipfs  |
   |           <-------------------+           |
   +-----^-----+                   +-----^-----+
         |                               |
         | HTTP API                      | HTTP API
         |                               |
+-------------------+         +-------------------+
+-------------------+         +-------------------+
|                   |         |                   |
|                   |         |                   |
|     Browser 1     |         |     Browser 2     |
|                   |         |                   |
|                   |         |                   |
|                   |         |                   |
+-------------------+         +-------------------+
```

### 1. Start two IPFS nodes

To demonstrate pubsub we need two nodes running so pubsub messages can be passed between them.

Right now the easiest way to do this is to install and start a `js-ipfs` and `go-ipfs` node. There are other ways to do this, see [this document on running multiple nodes](https://github.com/ipfs-examples/js-ipfs-examples/running-multiple-nodes) for details.

### 2. Start the IPFS nodes

#### JS IPFS node

```sh
npm install -g ipfs
jsipfs init
# Configure CORS to allow ipfs-http-client to access this IPFS node
jsipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["http://127.0.0.1:8888"]'
# Start the IPFS node, enabling pubsub
jsipfs daemon
```

#### GO IPFS node

```sh
ipfs init
# Configure CORS to allow ipfs-http-client to access this IPFS node
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["http://127.0.0.1:8888"]'
# Start the IPFS node, enabling pubsub
ipfs daemon --enable-pubsub-experiment
```

### 3. Open two browsers and connect to each node

Now, open up **two** browser windows. This could be two tabs in the same browser or two completely different browsers, it doesn't matter. Navigate to http://127.0.0.1:8888 in both.

In the "API ADDR" field enter `/ip4/127.0.0.1/tcp/5001` in one browser and `/ip4/127.0.0.1/tcp/5002` in the other and hit the "Connect" button.

This connects each browser to an IPFS node and now from the comfort of our browser we can instruct each node to listen to a pubsub topic and send/receive pubsub messages to each other.

> N.B. Since our two IPFS nodes are running on the same network they should have already found each other by MDNS. So you probably won't need to use the "CONNECT TO PEER" field. If you find your pubsub messages aren't getting through, check the output from your `jsipfs daemon` command and find the first address listed in "Swarm listening on" - it'll look like `/ip4/127.0.0.1/tcp/4002/ipfs/Qm...`. Paste this address into the "CONNECT TO PEER" field for the browser that is connected to your go-ipfs node and hit connect.

Finally, use the "SUBSCRIBE TO PUBSUB TOPIC" and "SEND MESSAGE" fields to do some pubsub-ing, you should see messages sent from one browser appear in the log of the other (provided they're both subscribed to the same topic).

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
