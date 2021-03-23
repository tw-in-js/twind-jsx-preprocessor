import fetch from 'isomorphic-fetch'
import { join } from 'path'
import { createServer, InlineConfig, ViteDevServer } from 'vite'
import twindJsx from '../src'

// function sleep(ms: number) {
//   return new Promise<void>((resolve) => setTimeout(resolve, ms))
// }

let server: ViteDevServer | undefined

async function runTestServer(config?: InlineConfig) {
  server = await createServer({
    root: join(__dirname, 'fixtures/basic'),
    logLevel: 'silent',
    plugins: [twindJsx()],
    ...config,
  })

  await server.listen()
}

afterEach(async () => {
  await server?.close()
})

test('dev server - vite plugin performs transformations without errors', async () => {
  await runTestServer()

  const response = await fetch('http://localhost:3000/index.tsx')
  const text = await response.text()

  expect(response.ok).toBe(true)
  expect(text).toContain('className: _tw`bg-blue-500`')
})
