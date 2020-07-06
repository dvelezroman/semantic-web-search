module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: ['plugin:react/recommended', 'google'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks'],
  settings: {
    react: {
      pragma: 'React',
      version: '16.8.6',
    },
  },
  rules: {
    indent: ['error', 2, { SwitchCase: 1 }],
    'max-len': ['error', 90],
    'react/prop-types': 0,
    'require-jsdoc': 0,
    'object-curly-spacing': 0,
    'no-eval': 2,
    'no-underscore-dangle': 1,
    'arrow-body-style': 1,
    'no-shadow': 0,
    'consistent-return': 0,
    'no-nested-ternary': 2,
    'no-console': 1,
    'no-case-declarations': 0,
    'import/prefer-default-export': 0,
    'no-else-return': 2,
    'react-hooks/rules-of-hooks': 2,
    'react-hooks/exhaustive-deps': 1,
    'operator-linebreak': 0,
    'quote-props': 0,
    'prefer-promise-reject-errors': 0,
    'space-before-function-paren': 0,
  },
};
