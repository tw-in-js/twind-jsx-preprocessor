import { preprocess } from './index'

test('simple', async () => {
  const result = await preprocess(`<button tw="bg-blue-500" />`)
  expect(result?.code).toMatchInlineSnapshot(`
    "import { tw as _tw } from \\"twind\\";
    <button className={/*#__PURE__*/_tw\`bg-blue-500\`} />;"
  `)
})

test('complex', async () => {
  const result = await preprocess(`
    <button tw={['bg-blue-500', condition && 'text-white', { 'leading-none': true }]} />
  `)
  expect(result?.code).toMatchInlineSnapshot(`
    "import { tw as _tw } from \\"twind\\";
    <button className={/*#__PURE__*/_tw\`\${'bg-blue-500'} \${condition && 'text-white'} \${{
      'leading-none': true
    }}\`} />;"
  `)
})

test('existing tw import', async () => {
  const result = await preprocess(`
    import { tw } from 'twind'
    const redText = tw\`text-red-500\`
    export default <button tw={[blueBg, redText]} />
  `)
  expect(result?.code).toMatchInlineSnapshot(`
    "import { tw as _tw } from \\"twind\\";
    import { tw } from 'twind';
    const redText = tw\`text-red-500\`;
    export default <button className={/*#__PURE__*/_tw\`\${blueBg} \${redText}\`} />;"
  `)
})

test('extra props', async () => {
  const result = await preprocess(`
    <button type="button" tw="bg-blue-500" aria-label="Awesome Button" style={{ color: 'red' }} />
  `)
  expect(result?.code).toMatchInlineSnapshot(`
    "import { tw as _tw } from \\"twind\\";
    <button type=\\"button\\" aria-label=\\"Awesome Button\\" style={{
      color: 'red'
    }} className={/*#__PURE__*/_tw\`bg-blue-500\`} />;"
  `)
})

test('className merging', async () => {
  const result = await preprocess(`
    <button className="some-third-party-class" tw="text-red-500" />
  `)
  expect(result?.code).toMatchInlineSnapshot(`
    "import { tw as _tw } from \\"twind\\";
    <button className={\`\${\\"some-third-party-class\\" || \\"\\"} \${/*#__PURE__*/_tw\`text-red-500\`}\`} />;"
  `)
})

test('transforms on host elements and components', async () => {
  const result = await preprocess(`
    <>
      <button tw="text-red-500" />
      <p tw="text-red-500" />
      <x-custom tw="text-red-500" />
      <foreignObject tw="text-red-500" />
      <Button tw="text-red-500" />
      <motion.div tw="text-red-500" />
    </>
  `)
  expect(result?.code).toMatchInlineSnapshot(`
    "import { tw as _tw } from \\"twind\\";
    <>
          <button className={/*#__PURE__*/_tw\`text-red-500\`} />
          <p className={/*#__PURE__*/_tw\`text-red-500\`} />
          <x-custom className={/*#__PURE__*/_tw\`text-red-500\`} />
          <foreignObject className={/*#__PURE__*/_tw\`text-red-500\`} />
          <Button className={/*#__PURE__*/_tw\`text-red-500\`} />
          <motion.div className={/*#__PURE__*/_tw\`text-red-500\`} />
        </>;"
  `)
})

test('component extension', async () => {
  const result = await preprocess(`
    const Button = ({ tw, className, ...props }) => (
      <button
        type="button"
        tw={\`bg-blue-500 text-white \${tw}\`}
        className={className}
        {...props}
      />
    )  
  `)
  expect(result?.code).toMatchInlineSnapshot(`
    "import { tw as _tw } from \\"twind\\";

    const Button = ({
      tw,
      className,
      ...props
    }) => <button type=\\"button\\" {...props} className={\`\${className || \\"\\"} \${/*#__PURE__*/_tw\`bg-blue-500 text-white \${tw}\`}\`} />;"
  `)
})

test('lazy import - only import if there were transformations', async () => {
  const result = await preprocess(`<button />`)
  expect(result?.code).toMatchInlineSnapshot(`"<button />;"`)
})
