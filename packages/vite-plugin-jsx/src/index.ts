import { preprocess } from '@twind/jsx-preprocessor'
import type { Plugin } from 'vite'

const jsxFileRegex = /\.(js|jsx|ts|tsx|mjs|cjs)?$/i

export default function twindJsx(): Plugin {
  return {
    name: 'twind-jsx',
    enforce: 'pre',
    async transform(source, filename) {
      if (jsxFileRegex.test(filename) && !filename.includes('node_modules')) {
        const result = await preprocess(source)
        if (result) {
          return { code: result.code ?? undefined, map: result.map }
        }
      }
      return undefined
    },
  }
}
