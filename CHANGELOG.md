## [0.10.4](https://github.com/4Catalyzer/astroturf/compare/v0.10.3...v0.10.4) (2020-04-13)


### Bug Fixes

* Don't generate source map unnecessarily ([#586](https://github.com/4Catalyzer/astroturf/issues/586)) ([260849b](https://github.com/4Catalyzer/astroturf/commit/260849bff773081341a084e63bc2618c3fbd3d34))





# [0.10.3](https://github.com/4Catalyzer/astroturf/compare/v0.10.2...v0.10.3) (2020-04-08)


### Features

* generate js sourcemaps using magic-string ([#579](https://github.com/4Catalyzer/astroturf/issues/579)) ([3fa4acf](https://github.com/4Catalyzer/astroturf/commit/3fa4acf))





# [0.10.2](https://github.com/4Catalyzer/astroturf/compare/v0.10.1...v0.10.2) (2020-12-04)


### Bug Fixes

* Remove broken skip shortcut in loader ([#523](https://github.com/4Catalyzer/astroturf/issues/523)) ([ca92cf9](https://github.com/4Catalyzer/astroturf/commit/ca92cf9))





# [0.10.1](https://github.com/4Catalyzer/astroturf/compare/v0.10.0...v0.10.1) (2020-12-03)


### Bug Fixes

* styledTag not used in styled output correctly ([#525](https://github.com/4Catalyzer/astroturf/issues/525)) ([c3c537e](https://github.com/4Catalyzer/astroturf/commit/c3c537e))





# [0.10.0](https://github.com/4Catalyzer/astroturf/compare/v0.9.21...v0.10.0) (2020-12-03)


### Bug Fixes

* composes on wrong class ([#471](https://github.com/4Catalyzer/astroturf/issues/471)) ([afdb371](https://github.com/4Catalyzer/astroturf/commit/afdb371)), closes [#365](https://github.com/4Catalyzer/astroturf/issues/365)
* Fix typing for withProps ([#506](https://github.com/4Catalyzer/astroturf/issues/506)) ([1ee0de1](https://github.com/4Catalyzer/astroturf/commit/1ee0de1))
* inline css prop requires so they are in the correct order ([#524](https://github.com/4Catalyzer/astroturf/issues/524)) ([07f8e32](https://github.com/4Catalyzer/astroturf/commit/07f8e32))
* pass correct object to resolve ([#456](https://github.com/4Catalyzer/astroturf/issues/456)) ([6348f97](https://github.com/4Catalyzer/astroturf/commit/6348f97))


### BREAKING CHANGES

* changes the import order for styles which affects the cascade (should be correct now)





## [0.9.21](https://github.com/4Catalyzer/astroturf/compare/v0.9.20...v0.9.21) (2019-10-11)


### Features

* only warn on possible cycle ([#441](https://github.com/4Catalyzer/astroturf/issues/441)) ([513b686](https://github.com/4Catalyzer/astroturf/commit/513b686))





## [0.9.20](https://github.com/4Catalyzer/astroturf/compare/v0.9.19...v0.9.20) (2019-10-08)


### Bug Fixes

* false positive on createElement ([2a659df](https://github.com/4Catalyzer/astroturf/commit/2a659df))





## [0.9.19](https://github.com/4Catalyzer/astroturf/compare/v0.9.18...v0.9.19) (2019-10-08)


### Features

* find css props when using createElement ([#431](https://github.com/4Catalyzer/astroturf/issues/431)) ([c82a67e](https://github.com/4Catalyzer/astroturf/commit/c82a67e))





## [0.9.18](https://github.com/4Catalyzer/astroturf/compare/v0.9.17...v0.9.18) (2019-09-25)


### Bug Fixes

* increase cycle timeout ([ce2df5f](https://github.com/4Catalyzer/astroturf/commit/ce2df5f))





## [0.9.17](https://github.com/4Catalyzer/astroturf/compare/v0.9.16...v0.9.17) (2019-09-11)


### Bug Fixes

* make sure loader added styled components are pure ([fa5b6e3](https://github.com/4Catalyzer/astroturf/commit/fa5b6e3))
* false positive cycle dectection ([3fb1cb9](https://github.com/4Catalyzer/astroturf/commit/3fb1cb9))





## [0.9.16](https://github.com/4Catalyzer/astroturf/compare/v0.9.15...v0.9.16) (2019-09-03)


### Bug Fixes

* 🐛 update webpack timestamps on loader file emit ([#382](https://github.com/4Catalyzer/astroturf/issues/382)) ([33b865f](https://github.com/4Catalyzer/astroturf/commit/33b865f)), closes [#381](https://github.com/4Catalyzer/astroturf/issues/381)





## [0.9.15](https://github.com/4Catalyzer/astroturf/compare/v0.9.14...v0.9.15) (2019-09-03)


### Bug Fixes

* **perf:** add virtual css timestamps to webpack compilation ([#381](https://github.com/4Catalyzer/astroturf/issues/381)) ([d9965ee](https://github.com/4Catalyzer/astroturf/commit/d9965ee))
* codeframe colors ([4bd8d32](https://github.com/4Catalyzer/astroturf/commit/4bd8d32))





## [0.9.13](https://github.com/4Catalyzer/astroturf/compare/v0.9.12...v0.9.13) (2019-08-13)


### Features

* add support for custom css properties ([#348](https://github.com/4Catalyzer/astroturf/issues/348)) ([6801760](https://github.com/4Catalyzer/astroturf/commit/6801760))





## [0.9.12](https://github.com/4Catalyzer/astroturf/compare/v0.9.11...v0.9.12) (2019-08-08)


### Bug Fixes

* fragments in typescript ([#341](https://github.com/4Catalyzer/astroturf/issues/341)) ([999dbfd](https://github.com/4Catalyzer/astroturf/commit/999dbfd))





## [0.9.11](https://github.com/4Catalyzer/astroturf/compare/v0.9.10...v0.9.11) (2019-08-08)


### Bug Fixes

* **types:** fix up css prop types ([85d12d9](https://github.com/4Catalyzer/astroturf/commit/85d12d9))





## [0.9.10](https://github.com/4Catalyzer/astroturf/compare/v0.9.9...v0.9.10) (2019-08-06)


### Features

* add cross-file dependency resolution ([#327](https://github.com/4Catalyzer/astroturf/issues/327)) ([ffd5186](https://github.com/4Catalyzer/astroturf/commit/ffd5186))
* add css prop and clean up testing ([#308](https://github.com/4Catalyzer/astroturf/issues/308)) ([fa6e209](https://github.com/4Catalyzer/astroturf/commit/fa6e209))





## [0.9.9](https://github.com/4Catalyzer/astroturf/compare/v0.9.8...v0.9.9) (2019-07-18)


### Bug Fixes

* webpack 4.36.1 incompatibility ([4166ac1](https://github.com/4Catalyzer/astroturf/commit/4166ac1))





## [0.9.8](https://github.com/4Catalyzer/astroturf/compare/v0.9.7...v0.9.8) (2019-07-12)


### Bug Fixes

* better interpolation ([#300](https://github.com/4Catalyzer/astroturf/issues/300)) ([a7c3b93](https://github.com/4Catalyzer/astroturf/commit/a7c3b93))





## [0.9.7](https://github.com/4Catalyzer/astroturf/compare/v0.9.6...v0.9.7) (2019-07-05)


### Features

* allow interpolating components ([#267](https://github.com/4Catalyzer/astroturf/issues/267)) ([05f73f2](https://github.com/4Catalyzer/astroturf/commit/05f73f2))





## [0.8.1](https://github.com/4Catalyzer/astroturf/compare/v0.8.0...v0.8.1) (2018-10-24)


### Bug Fixes

* remove wrong peer dep ([a8c51cf](https://github.com/4Catalyzer/astroturf/commit/a8c51cf))





