module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
    browser: true
  },
  extends: 'eslint:recommended',
  rules: {
    'no-console': 0,
    'no-unused-vars': 0
  },
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      modules: true,
      experimentalObjectRestSpread: true
    }
  }
};
