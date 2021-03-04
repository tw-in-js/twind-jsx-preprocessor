# @twind/vite-plugin-jsx

A [Vite](https://vitejs.dev) plugin which adds JSX enhancements for [Twind](https://github.com/tw-in-js/twind)

## [Features](../../README.md#features)

## Usage

1. Install from npm:

   ```sh
   npm install -D @twind/vite-plugin-jsx
   ```

1. Add to the `plugins` section of your vite config:

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

And you're done!
