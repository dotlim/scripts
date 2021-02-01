const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const paths = require('./paths');

const dotlimConfigPath = path.resolve(paths.appRoot, 'dotlim.config.js');

let CUSTOM_CONFIG = {};

if (fs.existsSync(dotlimConfigPath)) {
  CUSTOM_CONFIG = require(dotlimConfigPath);
}

if (!_.isPlainObject(CUSTOM_CONFIG)) {
  throw new Error('dotlim.config.js must export plain object');
}

const defaultConfig = {
  root: paths.appRoot,
  open: true,
  port: 9010,
  dist: './dist',
  publicPath: '/',
  proxy: {},

  compilerOptions: {
    inlineRuntimeChunk: false,
    shouldUseSourceMap: false,
    imageInlineSizeLimit: 10000,
  },
};

module.exports = _.merge(defaultConfig, _.omit(CUSTOM_CONFIG, ['root']));
