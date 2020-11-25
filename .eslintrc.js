module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      modules: true,
    },
  },
  plugins: [
    'import',
    'react',
    'react-hooks',
    'babel',
    'prettier',
    '@tinkoff/eslint-plugin-escheck',
    '@tinkoff-fb/eslint-plugin-fb',
    '@typescript-eslint',
    'etc',
  ],
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
    '@tinkoff/escheck/no-includes': 'error',
    semi: ['error', 'never'],
    'space-before-blocks': 'error',
    'max-params': ['error', 4],
    '@tinkoff-fb/fb/es/no-object-values': ['error'],
    '@tinkoff-fb/fb/no-broken-imports': [
      'error',
      {
        allowModules: ['react', 'react-dom', '@tinkoff-fb/dev-env'],
      },
    ],
    curly: 'error',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      },
    },
  },
  overrides: [
    {
      files: ['*.js', '*.jsx'],
      parser: 'babel-eslint',
      parserOptions: {},
    },
    {
      files: ['**/__tests__/*.js'],
      rules: {
        '@tinkoff/escheck/no-includes': 'off',
      },
    },
    {
      files: ['tools/**/**'],
      rules: {
        '@tinkoff/escheck/no-includes': 'off',
        'no-console': 'off',
      },
    },
    {
      files: [
        'packages/fields-uikit/utils/generateMultistory.tsx',
        'tests/**/*.js',
        '**/__acceptance__/**/*.{js,jsx,ts,tsx}',
        '**/__mocks__/**/*.{js,jsx,ts,tsx}',
        '**/__tests__/**/*.{js,jsx,ts,tsx}',
        '**/__inbrowser__/**/*.{js,jsx,ts,tsx}',
        '**/__stories__/**/*.{js,jsx,ts,tsx}',
        '**/__demo__/*.{js,jsx,ts,tsx}',
        '**/__demo__/**/*.{js,jsx,ts,tsx}',
        '**/__demo__/**/**/*.{js,jsx,ts,tsx}',
        '**/demo/*.{js,jsx,ts,tsx}',
        '**/*.stories.{js,jsx,ts,tsx}',
        'packages/forms-stories/DSLCompiler/**/*.js',
        '**/src/demo/**/*.js',
        'packages/address-dadata-manual/demo/**/*.js',
        'packages/progress-bar/demo/**/*.js',
        'packages/composer/demo/**/*.js',
      ],
      rules: {
        '@tinkoff-fb/fb/no-broken-imports': 'off',
        '@tinkoff-fb/fb/es/no-object-values': 'off',
      },
    },
    {
      files: ['**/*.{ts,tsx}'],
      rules: {
        'react/jsx-curly-brace-presence': 'off',
        'no-console': 'off',
        'max-params': 'off',
        'import/extensions': 'off',
        'no-unused-vars': 'off',
        'etc/prefer-interface': ['warn', { 'allowLocal': true }],
      },
    },
    {
      files: ['**/__acceptance__/**/*.{js,jsx,ts,tsx}'],
      rules: {
        // в тестах может быть инъекцированно неограниченное число component-object
        'max-params': 'off',
      },
    },
  ],
  env: {
    browser: true,
    node: true,
  },
}
