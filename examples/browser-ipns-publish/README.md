<p align="center">
  <a href="https://js.ipfs.io" title="JS IPFS">
    <img src="https://ipfs.io/ipfs/Qme6KJdKcp85TYbLxuLV7oQzMiLremD7HMoXLZEmgo6Rnh/js-ipfs-sticker.png" alt="IPFS in JavaScript logo" width="244" />
  </a>
</p>

<h3 align="center"><b>Publish to IPNS</b></h3>

<p align="center">
  <b><i>Publish to IPNS from the browser using ipfs-http-client</i></b>
  <br />
  <br />
  <img src="https://raw.githubusercontent.com/jlord/forkngo/gh-pages/badges/cobalt.png" width="200">
  <br>
  <a href="https://github.com/ipfs/js-ipfs/tree/master/docs">Explore the docs</a>
  ·
  <a href="https://githubbox.com/ipfs-examples/js-ipfs-examples/tree/master/examples/browser-ipns-publish">View Demo</a>
  ·
  <a href="https://github.com/ipfs-examples/js-ipfs-examples/issues">Report Bug</a>
  ·
  <a href="https://github.com/ipfs-examples/js-ipfs-examples/issues">Request Feature/Example</a>
</p>

## Table of Contents

- [Table of Contents](#table-of-contents)
- [About The Project](#about-the-project)
- [Getting Started](#getting-started)
  - [Pre requisites](#pre-requisites)
  - [Installation and Running example](#installation-and-running-example)
- [Usage](#usage)
  - [Start two IPFS nodes](#start-two-ipfs-nodes)
    - [Install and start the Go IPFS node](#install-and-start-the-go-ipfs-node)
  - [Open the demo in a browser and connect to the go-node](#open-the-demo-in-a-browser-and-connect-to-the-go-node)
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

### Pre requisites

Make sure you have installed all of the following prerequisites on your development machine:

- Git - [Download & Install Git](https://git-scm.com/downloads). OSX and Linux machines typically have this already installed.
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.
- IPFS Daemon - [Download & Install IPFS Desktop](https://docs.ipfs.io/install/ipfs-desktop/) that will run the go version of IPFS or head over to https://dist.ipfs.io/#go-ipfs and hit the "Download go-ipfs" button. Extract the archive and read the instructions to install.

### Installation and Running example

```console
> npm install
> npm start
```

Now open your browser at `http://localhost:8888`

## Usage

This example is a demo web application that allows you to connect to a go-IPFS node, and publish your IPNS record to the go-DHT network but using your js-ipfs private key. We'll start two IPFS nodes; one in the browser and one on a go-Server. We'll use `ipfs-http-client` to connect to the go-Node to ensure our pubsub messages are getting through, and confirm the IPNS record resolves on the go-Node. We're aiming for something like this:

```
   +-----------+     websocket     +-----------+
   |           +------------------->           |
   |  js-ipfs  |      pubsub       |  go-ipfs  |
   |           <-------------------+           |
   +-----^-----+                   +-----^-----+
         |                               |
         | IPFS in browser               | HTTP API
         |                               |
+-------------------------------------------------+
|                     Browser                     |
+-------------------------------------------------+
|                   |         |                   |
|                   |         |                   |
|  IPFS direct      |         |  js-http-client   |
|  a.k.a. ipfsNode  |         |  a.k.a. ipfsAPI   |
|                   |         |                   |
+-------------------------------------------------+
```

### Start two IPFS nodes

The first node is the js-ipfs made in the browser and the demo does that for you.

The second is a go-ipfs node on a server. To get our IPNS record to the DHT, we'll need [a server running go-IPFS](https://blog.ipfs.io/22-run-ipfs-on-a-vps/) with the API enabled on port 5001.

Right now the easiest way to do this is to install and start a `go-ipfs` node.

#### Install and start the Go IPFS node

If you do not have the ipfs installed, head over to https://dist.ipfs.io/#go-ipfs and hit the "Download go-ipfs" button. Extract the archive and read the instructions to install.

After installation:

```sh
ipfs init
# Configure CORS to allow ipfs-http-client to access this IPFS node
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin "[\"*\"]"
# Configure go-ipfs to listen on a websocket address
npx json -I -f ~/.ipfs/config -e "this.Addresses.Swarm.push('/ip4/127.0.0.1/tcp/4003/ws')"
# Start the IPFS node, enabling pubsub and IPNS over pubsub
ipfs daemon --enable-pubsub-experiment --enable-namesys-pubsub
```

### Open the demo in a browser and connect to the go-node

Now, open up the demo in a browser window.

In the "CONNECT TO GO-IPFS VIA API MULTIADDRESS" field enter `/ip4/YourServerIP/tcp/5001` (where `YourSeverIP` is your server's IP address or use `/dns4/yourdomain.com/tcp/5001`) and click connect. Once it connects, put your go-IPFS websocket address in the next field `/dns4/yourdomain.com/tcp/4003/wss/p2p/QmPeerIDHash` and hit the second "Connect" button.

This connects the API to the go-Node and connects your js-IPFS node via websocket to the go-IPFS node so pubsub will work.

You can choose whether to publish this record under the PeerId of the node that is running in the browser ('self') or choose to add a custom key to the IPFS keychain and publish under that instead. Either should work.

Finally, enter `/ipfs/QmSomeHash` as the content you want to publish to IPNS. You should see the messages sent from the browser to the server appear in the logs below, ending with "Success, resolved" if it all worked.

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
