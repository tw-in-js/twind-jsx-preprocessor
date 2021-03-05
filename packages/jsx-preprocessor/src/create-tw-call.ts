import { types } from '@babel/core'
import { isTruthy } from './helpers'

export function createTwCall(
  value: types.Expression,
  twFnName: string,
): types.CallExpression | types.TaggedTemplateExpression {
  const twIdentifier = types.identifier(twFnName)

  if (types.isStringLiteral(value)) {
    return types.taggedTemplateExpression(
      twIdentifier,
      types.templateLiteral([types.templateElement({ raw: value.value })], []),
    )
  }

  if (types.isArrayExpression(value)) {
    // an element will be null in the case of holes in the array, e.g. [a,,c]
    // i believe we can just ignore those
    const elements = value.elements.filter(isTruthy)

    // for now, we won't bother trying to optimize this if there's a spread in the array
    // it's probably possible to do, but likely rare in practice
    if (onlyContainsExpressions(elements)) {
      const constantParts = [
        types.templateElement({ raw: '' }),
        ...Array.from({ length: elements.length - 1 }, () => types.templateElement({ raw: ' ' })),
        types.templateElement({ raw: '' }),
      ]

      return types.taggedTemplateExpression(
        types.identifier(twFnName),
        types.templateLiteral(constantParts, elements),
      )
    }
  }

  // for complex calls, pass the expression as-is
  return types.callExpression(types.identifier(twFnName), [value])
}

function onlyContainsExpressions(nodes: types.Node[]): nodes is types.Expression[] {
  return nodes.every((node) => types.isExpression(node))
}
