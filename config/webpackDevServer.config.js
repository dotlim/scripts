const paths = require('./paths');
const config = require('./dotlim.config');

const publicPath =
  config.publicPath !== '/' && config.publicPath.endsWith('/') ? config.publicPath.slice(0, -1) : config.publicPath;

module.exports = {
  publicPath,
  contentBase: paths.appPublic,
  contentBasePublicPath: publicPath,
  watchContentBase: true,
  hot: true,
  compress: true,
  clientLogLevel: 'none',
  transportMode: 'ws',
  injectClient: true,
  quiet: true,
  overlay: false,
  proxy: config.devServer.proxy,
};
