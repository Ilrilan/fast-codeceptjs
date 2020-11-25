module.exports = {
  plugins: ['import', 'react', 'react-hooks', 'prettier'],
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      modules: true,
      jsx: true,
    },
  },
  rules: {
    'import/extensions': ['error', 'never', { css: 'always', json: 'always' }],
    'no-console': 'error',
    'no-unused-vars': ['error', { vars: 'all', args: 'none', ignoreRestSiblings: true }],
    'no-restricted-imports': ['warn', 'prop-types'],
    'import/prefer-default-export': 'off',
    'react/jsx-uses-vars': 'warn',
    'react/jsx-uses-react': 'warn',
    'react/react-in-jsx-scope': 'warn',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'object-curly-spacing': ['error', 'always'],
    'react/jsx-curly-brace-presence': ['warn', 'never'],
    semi: ['error', 'never'],
    'space-before-blocks': 'error',
    'max-params': ['error', 4],
    curly: 'error',
  },
  env: {
    browser: true,
    node: true,
  },
}
