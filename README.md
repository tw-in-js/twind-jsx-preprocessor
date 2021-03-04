# Twind JSX Preprocessors

Monorepo for adding JSX enhancements to [twind](https://twind.dev), including the `tw` prop, and various compile-time optimizations ✨

## Integrations

To enable the preprocessor, use one of these integrations:

- [Babel Macro](./packages/macro/README.md)
- [Vite Plugin](./packages/vite-plugin-jsx/README.md)

## Features

### `tw` Prop

A convenient shorthand for `className={tw(...)}`

```js
// completely original example 😏
const Notification = ({ title, message }) => (
  <div tw="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4">
    <div tw="flex-shrink-0">
      <img tw="h-12 w-12" src="/img/logo.svg" alt="ChitChat Logo" />
    </div>
    <div>
      <div tw="text-xl font-medium text-black">{title}</div>
      <p tw="text-gray-500">{message}</p>
    </div>
  </div>
)

// compiles to:

import { tw } from 'twind'

const Notification = ({ title, message }) => (
  <div
    className={tw`p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4`}
  >
    <div className={tw`flex-shrink-0`}>
      <img className={tw`h-12 w-12`} src="/img/logo.svg" alt="ChitChat Logo" />
    </div>
    <div>
      <div className={tw`text-xl font-medium text-black`}>{title}</div>
      <p className={tw`text-gray-500`}>{message}</p>
    </div>
  </div>
)
```

Also works nicely with `css`, `apply`, and others

```js
import { apply } from 'twind'
import { css } from 'twind/css'

const buttonStyle = apply`
	block p-3 w-full
	font-medium text-left leading-none
	transition
	ring(2 inset transparent)
	hover:(bg-green-100 text-green-900)
	focus:ring-green-500
`

const Example = () => (
  <section tw={css({ position: 'absolute', top: '137px' })}>
    <button tw={buttonStyle}>Hi, twind!</button>
  </section>
)
```

## Contribute

Thanks for being willing to contribute!

> This project is free and open-source, so if you think this project can help you or anyone else, you may [star it on GitHub](https://github.com/tw-in-js/twind-jsx-preprocessor). Feel free to [open an issue](https://github.com/tw-in-js/twind-jsx-preprocessor/issues) if you have any idea, question, or you've found a bug.

**Working on your first Pull Request?** You can learn how from this _free_ series [How to Contribute to an Open Source Project on GitHub](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github)

We are following the [Conventional Commits](https://www.conventionalcommits.org) convention.

### Develop

Clone the repository and cd into the project directory.

Run `yarn install`.

- `lerna run test`: Run test suite including linting
- `lerna run format`: Ensure consistent code style
- `lerna run build`: Build all packages
- `lerna publish`: To publish all changed packages

## License

[MIT](https://github.com/tw-in-js/twind-jsx-preprocessor/blob/main/LICENSE)
