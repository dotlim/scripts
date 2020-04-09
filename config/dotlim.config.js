const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const appDirectory = fs.realpathSync(process.cwd());
const customConfigPath = path.resolve(appDirectory, 'dotlim.config.js');

let CUSTOM_CONFIG = {};

if (fs.existsSync(customConfigPath)) {
  CUSTOM_CONFIG = require(customConfigPath);
}

if (!_.isPlainObject(CUSTOM_CONFIG)) {
  throw new Error('dotlim.config.js must export plain object');
}

const DEFAULT_CONFIG = {
  root: appDirectory,
  open: true,
  port: 8007,
  dist: './dist',
  publicPath: '/',
  proxy: {}
};

module.exports = _.merge(DEFAULT_CONFIG, _.omit(CUSTOM_CONFIG, ['root']));
