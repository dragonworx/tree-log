# Changelog

## [2.2.1](https://github.com/dragonworx/turbo-log/compare/turbo-log-v2.2.0...turbo-log-v2.2.1) (2022-08-08)


### Bug Fixes

* ensure browser warning is cleared when log re-enabled ([38f3a90](https://github.com/dragonworx/turbo-log/commit/38f3a90e922fff83e93facdb0cecb47cc33547b9))

## [2.2.0](https://github.com/dragonworx/turbo-log/compare/turbo-log-v2.1.0...turbo-log-v2.2.0) (2022-08-08)


### Features

* fix circular ref, add options to printLog() and return output ([68fb2a4](https://github.com/dragonworx/turbo-log/commit/68fb2a4ef06083d18f0eee1da92341c72c5f82f6))

## [2.1.0](https://github.com/dragonworx/turbo-log/compare/turbo-log-v2.0.4...turbo-log-v2.1.0) (2022-08-08)


### Features

* enable logging by default ([f34ea55](https://github.com/dragonworx/turbo-log/commit/f34ea551e1ad7ae48d620ecb024c8cfd399efdad))

## [2.0.4](https://github.com/dragonworx/turbo-log/compare/turbo-log-v2.0.3...turbo-log-v2.0.4) (2022-08-07)


### Bug Fixes

* update readme with bundle size ([b5a6aed](https://github.com/dragonworx/turbo-log/commit/b5a6aed69a404170c0891a83288c504d60343156))

## [2.0.3](https://github.com/dragonworx/turbo-log/compare/turbo-log-v2.0.2...turbo-log-v2.0.3) (2022-08-07)


### Bug Fixes

* add readme to .npmignore ([e2d2625](https://github.com/dragonworx/turbo-log/commit/e2d26251a0f9236c3065e4e102dbec6be57887d9))

## [2.0.2](https://github.com/dragonworx/turbo-log/compare/turbo-log-v2.0.1...turbo-log-v2.0.2) (2022-08-07)


### Bug Fixes

* add exclusions to .npmignore ([68ca39a](https://github.com/dragonworx/turbo-log/commit/68ca39a7494301508504f18f7a5a273d77b770ee))

## [2.0.1](https://github.com/dragonworx/turbo-log/compare/turbo-log-v2.0.0...turbo-log-v2.0.1) (2022-08-07)


### Bug Fixes

* update disbled info ([ed56856](https://github.com/dragonworx/turbo-log/commit/ed568568ac2a2dd02046c1c6734ce5e3d9050462))

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
