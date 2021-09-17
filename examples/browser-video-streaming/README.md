<p align="center">
  <a href="https://js.ipfs.io" title="JS IPFS">
    <img src="https://ipfs.io/ipfs/Qme6KJdKcp85TYbLxuLV7oQzMiLremD7HMoXLZEmgo6Rnh/js-ipfs-sticker.png" alt="IPFS in JavaScript logo" width="244" />
  </a>
</p>

<h3 align="center"><b>js-ipfs video streaming with hls.js</b></h3>

<p align="center">
    <b><i>Streaming video in the browser with js-ipfs and hls.js</i></b>
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
  - [Why use HLS?](#why-use-hls)
  - [hlsjs-ipfs-loader](#hlsjs-ipfs-loader)
  - [Generating HLS content](#generating-hls-content)
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

Now open your browser at `http://localhost:8888`

## Usage

This example shows a method for video/audio streaming in the browser over IPFS.

_Note:_ If you try to run the example straight from disk, some browsers (e.g Chrome) might, for security reasons, prevent some resources from loading correctly. To get around this, simply cd into the directory of this example and use http-server from npm:

```console
$ npm install -g http-server
$ http-server
```

You should then be able to stream Big Buck Bunny by pointing your browser at http://localhost:8080.

In addition to video streaming, plain audio streaming works fine as well. Simply use the same ffmpeg + ipfs procedure as described above, but with your audio file as input. You may also want to change the video tag to `audio` (video tags will play plain audio as well, but the player looks a bit strange).

On a final note, without diving too deep into what the specific ffmpeg HLS options above mean, it's worth mentioning the `hls_time` option, which defines the length of each HLS chunk (in seconds) and is potentially interesting for performance tuning (see for example [this article](https://bitmovin.com/mpeg-dash-hls-segment-length/)).

_For more examples, please refer to the [Documentation](#documentation)_

### Why use HLS?

HLS (Apple's HTTP Live Streaming) is one of several protocols currently available for adaptive bitrate streaming.

One of the advantages of HLS over some other streaming technologies is that the content can be hosted on a plain old web server without any special server-side support. The way this works is that the original content (the stream or video/audio file) is split up into small MPEG2-TS segments before being uploaded to the server. The segments are then fetched by the HLS player on the fly (using regular HTTP GET requests) and get spliced together to a continuous stream.

In addition to the segments there are also so-called manifests (m3u8 files) which contain metadata about segments and their bitrates. A stream can contain segments of multiple bitrates and the HLS player will automatically switch to the optimal bitrate based on client performance.

The fact that HLS content is just "a bunch of files" makes it a good choice for IPFS (another protocol that works this way is MPEG-DASH, which could certainly be a good choice as well). Furthermore, the [hls.js](https://github.com/video-dev/hls.js) library enables straightforward integration with the HTML5 video element.

### hlsjs-ipfs-loader

The hls.js library ships with an HTTP based content loader only, but it's fortunately possible to configure custom content loaders as well, which is what makes IPFS streaming possible in this case. A loader implementation that fetches content using js-ipfs can be found [here](https://www.npmjs.com/package/hlsjs-ipfs-loader), and is easy to use on a regular HTML page:

```html
<script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
<script src="https://cdn.jsdelivr.net/npm/hlsjs-ipfs-loader@0.1.2"></script>
```

### Generating HLS content

In order for any of the above to be useful, we also need to have a way to actually generate HLS manifests and MPEG2-TS segments from an arbitrary video/audio file. Luckily, most new builds of `ffmpeg` are compiled with this capability.

For example, say we have a directory containing a video file `BigBuckBunny_320x180.mp4`. We can then create a sub directory and generate the HLS data there, and finally add it to IPFS:

```console
$ mkdir hls-bunny
$ cd hls-bunny
$ ffmpeg -i ../BigBuckBunny_320x180.mp4 -profile:v baseline -level 3.0 -start_number 0 -hls_time 5 -hls_list_size 0 -f hls master.m3u8
$ ipfs add -Qr .
```

The most important piece of information to note down is the name you choose for the HLS manifest (master.m3u8 in this example, but you're free to use any name), and the hash returned by `ipfs add`. Consult [streaming.js](streaming.js) for a full example of how these values are used.

## References

- Documentation:
  - [IPFS CONFIG](https://github.com/ipfs/js-ipfs/blob/master/docs/CONFIG.md)
  - [MISCELLANEOUS](https://github.com/ipfs/js-ipfs/blob/master/docs/core-api/MISCELLANEOUS.md)

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
