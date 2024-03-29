module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended'
    ],
    parser: '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint',
        'eslint-plugin-tsdoc'
    ],
    ignorePatterns: ['docs/**/*', 'dist/**/*', '*.js'],
    root: true,
    rules: {
        "tsdoc/syntax": "warn",
        "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
        "space-before-function-paren": ["error", "always"],
        "no-constant-condition": ["error", { "checkLoops": false }]
    }
}