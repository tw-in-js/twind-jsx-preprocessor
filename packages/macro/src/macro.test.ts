import * as babel from '@babel/core'
import { execSync } from 'child_process'

beforeAll(() => {
  execSync('yarn build', { cwd: __dirname })
})

test('tagged template literal transform', async () => {
  const code = `
    import "../dist/macro"
    export default function App() {
      return <>
        <h1 tw="font-bold">normal test</h1>
        <h1 tw={["font-bold"]}>array test</h1>
        <h1 tw={["font-bold", 123]}>array test</h1>
      </>
    }  
  `

  const result = await babel.transformAsync(code, {
    plugins: [
      '@babel/plugin-syntax-jsx',
      '@babel/plugin-transform-template-literals',
      'babel-plugin-macros',
    ],
    filename: __dirname + '/file.js',
    babelrc: false,
    configFile: false,
  })

  expect(result?.code).toMatchInlineSnapshot(`
    "var _templateObject, _templateObject2, _templateObject3;

    function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

    import { tw as _tw } from \\"twind\\";
    export default function App() {
      return <>
            <h1 className={/*#__PURE__*/_tw(_templateObject || (_templateObject = _taggedTemplateLiteral([\\"font-bold\\"])))}>normal test</h1>
            <h1 className={/*#__PURE__*/_tw(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral([\\"\\", \\"\\"])), \\"font-bold\\")}>array test</h1>
            <h1 className={/*#__PURE__*/_tw(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral([\\"\\", \\" \\", \\"\\"])), \\"font-bold\\", 123)}>array test</h1>
          </>;
    }"
  `)
})
