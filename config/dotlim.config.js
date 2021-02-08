const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const appDirectory = fs.realpathSync(process.cwd());
const dotlimConfigPath = path.resolve(appDirectory, 'example', 'dotlim.config.js');

let CUSTOM_CONFIG = {};

if (fs.existsSync(dotlimConfigPath)) {
  CUSTOM_CONFIG = require(dotlimConfigPath);
}

if (!_.isPlainObject(CUSTOM_CONFIG)) {
  throw new Error('dotlim.config.js must export plain object');
}

const defaultConfig = {
  root: appDirectory,

  publicPath: '/',
  entryFile: 'src/index.js',
  outputDir: 'build',
  lineOnSave: false,
  devServer: {
    hot: true,
    open: true,
    port: 9090,
    proxy: {},
  },
  compilerOptions: {
    inlineRuntimeChunk: false,
    shouldUseSourceMap: false,
    imageInlineSizeLimit: 10000,
    productionCache: true,
    productionGzip: false,
  },
};

module.exports = _.merge(defaultConfig, _.omit(CUSTOM_CONFIG, ['root']));
