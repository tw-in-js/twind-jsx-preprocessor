# @twind/macro

A Babel macro which adds JSX enhancements for [Twind](https://github.com/tw-in-js/twind)

## [Features](../../README.md#features)

## Usage

1. Add [babel-plugin-macros](https://github.com/kentcdodds/babel-plugin-macros) to your Babel config (if you use Create React App, it's already installed!)

1. Install:

   ```
   npm install -D @twind/macro
   ```

1. Import to use:

   ```jsx
   import '@twind/macro'

   const Button = (props) => (
     <button tw="bg-green-600 text-green-100 p-3 hover:bg-green-700 rounded" {...props} />
   )
   ```
