# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.0.1](https://github.com/ipfs/js-ipfs/compare/example-browser-readablestream@2.0.0...example-browser-readablestream@2.0.1) (2020-04-08)

**Note:** Version bump only for package example-browser-readablestream





# 2.0.0 (2020-03-31)


### Bug Fixes

* examples after files API refactor ([#1740](https://github.com/ipfs/js-ipfs/issues/1740)) ([34ec036](https://github.com/ipfs/js-ipfs/commit/34ec036b0df9563a014c1348f0a056c1f98aadad))


### Code Refactoring

* export types and utilities statically ([#1908](https://github.com/ipfs/js-ipfs/issues/1908)) ([79d7fef](https://github.com/ipfs/js-ipfs/commit/79d7fef7d28c0e0405fb69af149ff09681ac4273))


### Features

* Allows for byte offsets when using ipfs.files.cat and friends to request slices of files ([a93971a](https://github.com/ipfs/js-ipfs/commit/a93971a8905358a291b2cf3724df32382b05f5ce))


### BREAKING CHANGES

* `ipfs.util.isIPFS` and `ipfs.util.crypto` have moved to static exports and should be accessed via `const { isIPFS, crypto } = require('ipfs')`.

The modules available under `ipfs.types.*` have also become static exports.

License: MIT
Signed-off-by: Alan Shaw <alan.shaw@protocol.ai>
