import * as babel from "@babel/core"
import annotateAsPure from "@babel/helper-annotate-as-pure"
import traverse from "@babel/traverse"
import {
	findJsxAttributeByName,
	getJsxAttributeName,
	getJsxAttributeValue,
} from "./jsx-attribute"

/**
 * Mutatively(!) process an AST
 */
export function preprocessAst(ast: babel.types.Program | babel.types.File) {
	traverse(ast, {
		Program(program) {
			const localImportName = program.scope.generateUid("tw")

			traverse(program.node, {
				JSXOpeningElement(path) {
					const twAttribute = findJsxAttributeByName(path.node, "tw")
					const twAttributeValue = getJsxAttributeValue(twAttribute)
					if (!twAttributeValue) return

					const twCall = babel.types.callExpression(
						babel.types.identifier(localImportName),
						[twAttributeValue],
					)
					annotateAsPure(twCall)

					const classAttribute = findJsxAttributeByName(path.node, "className")
					const classAttributeValue = getJsxAttributeValue(classAttribute)

					const newAttributeValue = classAttributeValue
						? babel.types.templateLiteral(
								[
									babel.types.templateElement({ raw: "" }),
									babel.types.templateElement({ raw: " " }),
									babel.types.templateElement({ raw: "" }),
								],
								[classAttributeValue, twCall],
						  )
						: twCall

					path.node.attributes = path.node.attributes
						// remove existing tw and className attributes
						.filter(node => {
							const name = getJsxAttributeName(node)
							return name !== "tw" && name !== "className"
						})
						// add new className attribute
						.concat(
							babel.types.jsxAttribute(
								babel.types.jsxIdentifier("className"),
								babel.types.jsxExpressionContainer(newAttributeValue),
							),
						)
				},
			})

			program.node.body.unshift(
				babel.types.importDeclaration(
					[
						babel.types.importSpecifier(
							babel.types.identifier(localImportName),
							babel.types.identifier("tw"),
						),
					],
					babel.types.stringLiteral("twind"),
				),
			)
		},
	})
}

/**
 * Accept source code and process it
 */
export async function preprocess(
	code: string,
): Promise<babel.BabelFileResult | undefined> {
	const root = await babel.parseAsync(code, {
		configFile: false,
		babelrc: false,
		plugins: [
			require.resolve("@babel/plugin-syntax-jsx"),
			[require.resolve("@babel/plugin-syntax-typescript"), { isTSX: true }],
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
