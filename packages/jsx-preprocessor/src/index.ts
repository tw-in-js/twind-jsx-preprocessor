/// <reference path="../types/react.d.ts" />
import * as babel from '@babel/core'
import annotateAsPure from '@babel/helper-annotate-as-pure'
import traverse from '@babel/traverse'
import { createTwCall } from './create-tw-call'
import { findJsxAttributeByName, getJsxAttributeName, getJsxAttributeValue } from './jsx-attribute'

/**
 * Mutatively(!) process an AST
 *
 * @param ast A babel AST
 */
export function preprocessAst(ast: babel.types.Node) {
  traverse(ast, {
    Program(program) {
      const twFnName = program.scope.generateUid('tw')

      let hasTransformed = false

      traverse(program.node, {
        JSXOpeningElement(path) {
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
                [
                  // generate `${className || ''}`,
                  // so that we don't get `undefined` in the class string
                  // when the class name is undefined at runtime
                  //
                  // this can still be optimized though, e.g. in the case of a literal string,
                  // but I don't see that being common enough to account for
                  babel.types.logicalExpression(
                    '||',
                    classAttributeValue,
                    babel.types.stringLiteral(''),
                  ),
                  twCall,
                ],
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

          hasTransformed = true
        },
      })

      if (hasTransformed) {
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
      }
    },
  })
}

export type PreprocessOptions = {
  /** The path of the file being transformed. **This is needed if using source maps** */
  filename?: string
}

/**
 * Accept source code and process it
 */
export async function preprocess(
  code: string,
  { filename }: PreprocessOptions = {},
): Promise<babel.BabelFileResult | undefined> {
  const root = await babel.parseAsync(code, {
    configFile: false,
    babelrc: false,
    sourceMaps: true,
    parserOpts: {
      sourceFilename: filename,
    },
    plugins: [
      require.resolve('@babel/plugin-syntax-jsx'),
      [require.resolve('@babel/plugin-syntax-typescript'), { isTSX: true }],
    ],
  })

  if (!root) return undefined

  preprocessAst(root)

  const result = await babel.transformFromAstAsync(root, code, {
    configFile: false,
    babelrc: false,
    ast: true,
    sourceMaps: true,
  })

  return result ?? undefined
}
