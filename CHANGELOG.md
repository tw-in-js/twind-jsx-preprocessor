# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.1.1](https://github.com/tw-in-js/twind-jsx-preprocessor/compare/v2.1.0...v2.1.1) (2021-08-08)

**Note:** Version bump only for package twind-jsx-preprocessor-monorepo

# [2.1.0](https://github.com/tw-in-js/twind-jsx-preprocessor/compare/v2.0.4...v2.1.0) (2021-03-23)

### Bug Fixes

- pass filename to preprocess, fixes error with source maps ([1f05ad1](https://github.com/tw-in-js/twind-jsx-preprocessor/commit/1f05ad16fba65bcf5532a294b046f3717f7a5e8a))

### Features

- accept filename in options object ([4b292c3](https://github.com/tw-in-js/twind-jsx-preprocessor/commit/4b292c3992dc4c8b9e8afc871845d077a0e99b1c))

## [2.0.4](https://github.com/tw-in-js/twind-jsx-preprocessor/compare/v2.0.3...v2.0.4) (2021-03-13)

### Bug Fixes

- work with babel tagged template transform ([6d97d21](https://github.com/tw-in-js/twind-jsx-preprocessor/commit/6d97d217496fa3a73a37b284ff877b2ddf1af8c8))

## [2.0.3](https://github.com/tw-in-js/twind-jsx-preprocessor/compare/v2.0.2...v2.0.3) (2021-03-08)

### Bug Fixes

- react types: extend `Attributes` instead of `DOMAttributes` ([098f305](https://github.com/tw-in-js/twind-jsx-preprocessor/commit/098f305ef2658052dd13617a5fa6f59ebf5a08ab))

## [2.0.2](https://github.com/tw-in-js/twind-jsx-preprocessor/compare/v2.0.1...v2.0.2) (2021-03-08)

**Note:** Version bump only for package twind-jsx-preprocessor-monorepo

## [2.0.1](https://github.com/tw-in-js/twind-jsx-preprocessor/compare/v2.0.0...v2.0.1) (2021-03-08)

### Bug Fixes

- add back reference to react tw prop types ([1deafbc](https://github.com/tw-in-js/twind-jsx-preprocessor/commit/1deafbc4707131b44d940a5858f178cf81399986))

# [2.0.0](https://github.com/tw-in-js/twind-jsx-preprocessor/compare/v1.0.1...v2.0.0) (2021-03-08)

- feat!: also transform to className on components ([94ee419](https://github.com/tw-in-js/twind-jsx-preprocessor/commit/94ee4190077742a2fa54084240226f8ea2ccd324))

### BREAKING CHANGES

- I made a whole issue on this, but after some usage in practice, I believe transforming on all elements is the better DX. Here's why:

* In components, I had to write out logic for receiving both tw _and_ className, and it's a lot simpler (and twind-agnostic in some cases) to only receive className
* This makes it easier to use with third-party libraries, especially with unstyled components, and with any component that accepts className (many of them!)
* Adding on the previous point, the mismatch of having to think about whether I can use `tw=` vs. `className=` depending on what tag I'm using, I ended up making more mistakes in the middle of that, than if I could just use `tw` everywhere

So, for migration, your components will _not_ receive a `tw` prop, but instead, will only receive `className` in all cases. [See the updated docs](https://github.com/tw-in-js/twind-jsx-preprocessor/blob/main/docs/tw-prop.md#tw-overrides) for how you should write overridable components

Hopefully this should be a small breaking change, and that this should make the prop nicer to use in the future!

## [1.0.1](https://github.com/tw-in-js/twind-jsx-preprocessor/compare/v1.0.0...v1.0.1) (2021-03-05)

### Bug Fixes

- optimized template literal calls ([1a89088](https://github.com/tw-in-js/twind-jsx-preprocessor/commit/1a89088c3c2d504d12530206dfe16501aacd20f6))
- prevent `undefined` in class name strings ([b3d4cb7](https://github.com/tw-in-js/twind-jsx-preprocessor/commit/b3d4cb7be197ea6f1ab8042ed7cd50f7a5dd57df))

# 1.0.0 (2021-03-05)

### BREAKING CHANGES

- only transform on host elements ([549cac9](https://github.com/tw-in-js/twind-jsx-preprocessor/commit/549cac910747f19b554d480dbd395f8ba0dca2e8))

### Bug Fixes

- only add twind import if there were transformations ([320f583](https://github.com/tw-in-js/twind-jsx-preprocessor/commit/320f583e877036b9e787e5d0725cda4cd1acd33b))
- the tw call should use the locally imported name ([0d79319](https://github.com/tw-in-js/twind-jsx-preprocessor/commit/0d793195e9187671722523e789a6f7818d954d2a))

### Features

- template string optimization ([ff55328](https://github.com/tw-in-js/twind-jsx-preprocessor/commit/ff5532861878ff285fc277a6cad59ee3b4ecab68))
