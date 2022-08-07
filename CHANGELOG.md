# Changelog

## [2.0.0](https://github.com/dragonworx/turbo-log/compare/turbo-log-v1.0.1...turbo-log-v2.0.0) (2022-08-07)


### ⚠ BREAKING CHANGES

* refactor renderLog() into printLog() and snapshotLog()

### Features

* add browser support, refactor renderLog() ([1422add](https://github.com/dragonworx/turbo-log/commit/1422add9123ea40babbb8a0dc859cec4816f8037))

## [1.0.1](https://github.com/dragonworx/turbo-log/compare/turbo-log-v1.0.0...turbo-log-v1.0.1) (2022-08-06)


### Bug Fixes

* update readme to reflect nodejs only support ([3a48721](https://github.com/dragonworx/turbo-log/commit/3a48721680ce50e170c0c0b42b21cb923ecfa75e))

## [1.0.0](https://github.com/dragonworx/turbo-log/compare/turbo-log-v0.1.2...turbo-log-v1.0.0) (2022-08-05)


### ⚠ BREAKING CHANGES

* setLogEnabled() replaced with global setLogOptions(). renderLog() no longer takes options, moved same properties into setLogOptions().

### Features

* upgrade public API ([1a8cb05](https://github.com/dragonworx/turbo-log/commit/1a8cb052264edea59e7b86df21821588114b658d))
