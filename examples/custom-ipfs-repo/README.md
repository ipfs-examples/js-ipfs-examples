<p align="center">
  <a href="https://js.ipfs.io" title="JS IPFS">
    <img src="https://ipfs.io/ipfs/Qme6KJdKcp85TYbLxuLV7oQzMiLremD7HMoXLZEmgo6Rnh/js-ipfs-sticker.png" alt="IPFS in JavaScript logo" width="244" />
  </a>
</p>

<h3 align="center"><b>Custom IPFS repo</b></h3>

<p align="center">
  <b><i>How to customize a IPFS repository</i></b>
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
  - [Custom `storageBackends`](#custom-storagebackends)
  - [Custom Repo Lock](#custom-repo-lock)
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

This example shows you how to customize your repository, including where your data is stored and how the repo locking is managed. Customizing your repo makes it easier to extend IPFS for your particular needs. You may want to customize your repo if:

- If you want to store data somewhere that’s not on your local disk, like S3, a Redis instance, a different machine on your local network, or in your own database system, like MongoDB or PostgreSQL, you might use a custom datastore.
- If you have multiple browser windows or workers sharing the same IPFS storage, you might want to use a custom lock to coordinate between them. (Locking is currently only used to ensure a single IPFS instance can access a repo at a time. This check is done on `repo.open()`. A more complex lock, coupled with a custom datastore, could allow for safe writes to a single datastore from multiple IPFS nodes.)

You can find full details on customization in the [IPFS Repo Docs](https://github.com/ipfs/js-ipfs-repo#setup).

### Custom `storageBackends`

This example leverages [datastore-fs](https://github.com/ipfs/js-datastore-fs) to store all data in the IPFS Repo. You can customize each of the 4 `storageBackends` to meet the needs of your project. For an example on how to manage your entire IPFS REPO on S3, you can see the [datastore-s3 example](https://github.com/ipfs/js-datastore-s3/tree/master/examples/full-s3-repo).

### Custom Repo Lock

This example uses one of the locks that comes with IPFS Repo. If you would like to control how locking happens, such as with a centralized S3 IPFS Repo, you can pass in your own custom lock. See [custom-lock.js](./custom-lock.js) for an example of a custom lock that can be used for [datastore-s3](https://github.com/ipfs/js-datastore-s3). This is also being used in the [full S3 example](https://github.com/ipfs/js-datastore-s3/tree/master/examples/full-s3-repo).

```js
const S3Lock = require('./custom-lock')

const repo = new Repo('/tmp/.ipfs', {
  ...
  lock: new S3Lock(s3DatastoreInstance)
})
```

_For more examples, please refer to the [Documentation](#documentation)_

## References

- Documentation:
  - [IPFS REPO](https://github.com/ipfs/js-ipfs-repo#setup)
  - [IPFS CONFIG](https://github.com/ipfs/js-ipfs/blob/master/docs/CONFIG.md)
  - [MISCELLANEOUS](https://github.com/ipfs/js-ipfs/blob/master/docs/core-api/MISCELLANEOUS.md)
  - [FILES](https://github.com/ipfs/js-ipfs/blob/master/docs/core-api/FILES.md)
- Tutorials:
  - [Regular File API](https://proto.school/regular-files-api)
  - [libp2p](https://proto.school/introduction-to-libp2p)

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
