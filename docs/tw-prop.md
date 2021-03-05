# `tw` Prop

The `tw` prop is a convenient shorthand for `className={tw(...)}`

> **Note**: The prop is only supported on host elements (p, foriegnObject, x-custom-element). For components, the prop is left as-is, and the component receives the `tw` string as a prop.

Here's an example, shamelessly borrowed from the TailwindCSS docs 😏

```js
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

Also works nicely with `css`, `apply`, [and whatever you can pass to `tw()`](https://twind.dev/docs/modules/twind.html#tw-function)

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
    <button tw={buttonStyle}>Hi, Twind!</button>
  </section>
)
```

## Creating components

For single element styles, consider making partial styles with `apply` and reusing them:

```tsx
// components.ts
export const buttonStyle = apply`text-white rounded shadow p-3 bg-blue-600 hover:bg-blue-700`

// App.tsx
import { buttonStyle } from './components'

export default function App() {
  return (
    <main>
      <h1>Call to action!</h1>
      <button tw={buttonStyle}>Do it</button>
      <button tw={buttonStyle}>Or don't</button>
    </main>
  )
}
```

For more complex cases, our recommendation is to define explicit props for customizability. This avoids various caveats around css class ordering, precedence, implementation details, etc.

```tsx
import { ReactNode } from 'react'

type Props = {
  size?: 'medium' | 'large'
  color?: 'red' | 'blue'
  isLoading?: boolean
  children?: ReactNode
}

export default function Button({ size = 'medium', color = 'blue', isLoading, children }: Props) {
  const buttonStyle = apply`
    text-white rounded shadow
    ${size === 'medium' && `p-3`}
    ${size === 'large' && `p-4`}
    ${color === 'blue' && `bg-blue-600 hover:bg-blue-700`}
    ${color === 'red' && `bg-red-600 hover:bg-red-700`}
  `
  return (
    <button type="button" tw={buttonStyle} disabled={isLoading}>
      {isLoading ? children : 'Loading...'}
    </button>
  )
}
```

## `tw` overrides

One might want to create components where the style can be overridden via the `tw` prop. Here's how to do that:

```tsx
import { ReactNode, ComponentPropsWithoutRef } from 'react'
import { Token, css } from 'twind'

type Props = ComponentPropsWithoutRef<'button'> & {
  tw?: Token
}

export default function Button({ tw, className, ...props }: Props) {
  return (
    <button
      type="button"
      tw={apply`text-white rounded shadow p-3 bg-blue-600 hover:bg-blue-700 ${tw}`}
      className={className}
      {...props}
    />
  )
}

const example = (
  <>
    <Button>Default button</Button>
    <Button tw="bg-red-600 hover:bg-red-700">Red button</Button>
    <Button tw="p-4 text-xl">Big button</Button>
    <Button tw={css({ background: 'firebrick' })}>Firebrick button</Button>
  </>
)
```

A few things to note:

- `className={className}` is needed here, so that the transformer can see that prop, and merge it with the class generated from the `tw` prop. Without it, if we passed a `className` prop to `Button`, it could override the button's generated class.

  ```js
  // with `className={className}`, it compiles this:
  <button className={`${className} ${tw(apply`...`)}`} {...props} />

  // without, it compiles this:
  <button className={tw(apply`...`)} {...props} />
  ```

- In less simple cases, this has the potential to break implementation details of the component. e.g. the component declares a `grid` class internally, then receives a `flex` override, which messes up the layout. But for simple single-element cases like this, it's probably fine. ¯\\\_(ツ)\_/¯
