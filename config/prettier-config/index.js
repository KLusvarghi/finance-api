// como é um arquivo mjs e não tems typescript, precisamos usar o @type para definir o tipo do config, apra que possamos ter autocomplete e type checking
/**
 * @type {import("prettier").Config}
 */
const config = {
    plugins: ['prettier-plugin-tailwindcss'],
    printWidth: 80, // largura máxima da linha
    tabWidth: 2, // largura da tab
    singleQuote: true, // usa aspas simples para strings
    useTabs: false, // não usa tab para indentar
    semi: false, // não coloca ponto e vírgula no final da linha
    quoteProps: 'as-needed', // ele coloca aspas na propriedade do objeto quando necessário
    jsxSingleQuote: false, // usa aspas duplas para jsx
    trailingComma: 'es5', // coloca vírgula no final de objetos e arrays, mas não no final de arrays
    bracketSpacing: true, // coloca espaço entre parênteses
    arrowParens: 'always', // coloca parênteses em funções de uma linha
    bracketSameLine: false, // coloca parênteses na mesma linha
    proseWrap: 'preserve', // não quebra o texto
    endOfLine: 'auto', // auto detecta o tipo de quebra de linha
}

export default config
