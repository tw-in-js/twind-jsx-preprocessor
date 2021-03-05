import * as babel from '@babel/core'
import annotateAsPure from '@babel/helper-annotate-as-pure'
import traverse from '@babel/traverse'
import { createTwCall } from './create-tw-call'
import { findJsxAttributeByName, getJsxAttributeName, getJsxAttributeValue } from './jsx-attribute'

/**
 * Mutatively(!) process an AST
 */
export function preprocessAst(ast: babel.types.Node) {
  traverse(ast, {
    Program(program) {
      const twFnName = program.scope.generateUid('tw')

      traverse(program.node, {
        JSXOpeningElement(path) {
          // only transform on host elements
          if (!isHostElementName(path.node.name)) return

          const twAttribute = findJsxAttributeByName(path.node, 'tw')
          const twAttributeValue = getJsxAttributeValue(twAttribute)
          if (!twAttributeValue) return

          const twCall = createTwCall(twAttributeValue, twFnName)
          annotateAsPure(twCall)

          const classAttribute = findJsxAttributeByName(path.node, 'className')
          const classAttributeValue = getJsxAttributeValue(classAttribute)

          const newAttributeValue = classAttributeValue
            ? babel.types.templateLiteral(
                [
                  babel.types.templateElement({ raw: '' }),
                  babel.types.templateElement({ raw: ' ' }),
                  babel.types.templateElement({ raw: '' }),
                ],
                [classAttributeValue, twCall],
              )
            : twCall

          path.node.attributes = path.node.attributes
            // remove existing tw and className attributes
            .filter((node) => {
              const name = getJsxAttributeName(node)
              return name !== 'tw' && name !== 'className'
            })
            // add new className attribute
            .concat(
              babel.types.jsxAttribute(
                babel.types.jsxIdentifier('className'),
                babel.types.jsxExpressionContainer(newAttributeValue),
              ),
            )
        },
      })

      program.node.body.unshift(
        babel.types.importDeclaration(
          [
            babel.types.importSpecifier(
              babel.types.identifier(twFnName),
              babel.types.identifier('tw'),
            ),
          ],
          babel.types.stringLiteral('twind'),
        ),
      )
    },
  })
}

/**
 * Accept source code and process it
 */
export async function preprocess(code: string): Promise<babel.BabelFileResult | undefined> {
  const root = await babel.parseAsync(code, {
    configFile: false,
    babelrc: false,
    plugins: [
      require.resolve('@babel/plugin-syntax-jsx'),
      [require.resolve('@babel/plugin-syntax-typescript'), { isTSX: true }],
    ],
  })

  if (!root) return undefined

  preprocessAst(root)

  const result = await babel.transformFromAstAsync(root, undefined, {
    configFile: false,
    babelrc: false,
    ast: true,
    sourceMaps: true,
  })
  return result ?? undefined
}

/**
 * Returns true if the name is that of a JSX host element,
 * e.g. div, p, x-custom-element, foreignObject
 * and NOT a component
 */
function isHostElementName(nameNode: babel.types.Node) {
  const hostElementRegex = /^[a-z][a-zA-Z\-]*$/
  return babel.types.isJSXIdentifier(nameNode) && hostElementRegex.test(nameNode.name)
}
