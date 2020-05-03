const _ = require('lodash');

const OFF = 'off';
const WARN = 'warn';
const ERROR = 'error';

module.exports = _.merge(require('@dotlim/eslint-config').eslint, {
  rules: {
    'no-cond-assign': WARN,
    'no-console': OFF,
    'no-param-reassign': OFF,
    'no-plusplus': WARN,
    'no-unused-vars': WARN,
    'no-restricted-syntax': OFF,
    'no-trailing-spaces': ERROR,
    'no-underscore-dangle': OFF,
    'prefer-const': OFF
  }
});
