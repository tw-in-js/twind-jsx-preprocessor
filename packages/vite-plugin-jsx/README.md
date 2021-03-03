# @twind/vite-plugin-jsx

Vite plugin for the `tw` prop, for use with [`twind`](https://github.com/tw-in-js/twind)

```js
const Button = () => <button tw="bg-blue-500" />

// ⬇⬇⬇⬇⬇⬇

import { tw } from 'twind'
const Button = () => <button className={tw`bg-blue-500`} />
```

More complex usage is supported:

```js
const Button = () => (
  <button tw={['bg-blue-500', condition && 'text-red-500', { 'border-green-500': true }]} />
)

// ⬇⬇⬇⬇⬇⬇

import { tw } from 'twind'

const Button = () => (
  <button
    className={tw(['bg-blue-500', condition && 'text-red-500', { 'border-green-500': true }])}
  />
)
```

## Installation

Install from npm:

```sh
npm install -D @twind/vite-plugin-jsx
```

Add to the `plugins` section of your vite config:

```js
import { defineConfig } from 'vite'
import twindJsx from '@twind/vite-plugin-jsx'

export default defineConfig({
  // other config ...
  plugins: [
    // other plugins ...
    twindJsx(),
  ],
})
```
