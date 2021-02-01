module.exports = {
  root: true,
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: [require.resolve('@dotlim/fabric/lib/eslint')],
  rules: {
    // eslint
    'no-cond-assign': 'warn',
    'no-console': 'off',
    'no-param-reassign': 'off',
    'no-plusplus': 'warn',
    'no-unused-vars': 'warn',
    'no-restricted-syntax': 'off',
    'no-trailing-spaces': 'error',
    'no-underscore-dangle': 'off',
    'prefer-const': 'off',
  },
  parserOptions: {
    sourceType: 'module',
  },
};
