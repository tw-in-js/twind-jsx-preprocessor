import { preprocessAst } from '@twind/jsx-preprocessor'
import { createMacro, MacroParams } from 'babel-plugin-macros'

export default createMacro(function twindMacro({ state }: MacroParams) {
  preprocessAst(state.file.ast)
})
