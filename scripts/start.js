process.env.NODE_ENV = 'development';
process.env.BABEL_ENV = 'development';

const url = require('url');
const address = require('address');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const chalk = require('chalk');
const configFactory = require('../config/webpack.config');
const config = require('../config/dotlim.config');
const paths = require('../config/paths');
const devServerConfig = require('../config/webpackDevServer.config');

const isPrivateIP = ip => /^10[.]|^172[.](1[6-9]|2[0-9]|3[0-1])[.]|^192[.]168[.]/.test(ip);

// main

const appName = require(paths.appPackageJson).name;
const isOpen = Boolean(config.open);
const openHost = !isOpen ? false : config.open === true ? 'localhost' : config.open;
const isLocal = ['localhost', '127.0.0.1', '0.0.0.0'].includes(openHost);

const localUrl = url.format({
  protocol: 'http',
  hostname: openHost,
  port: config.port,
  pathname: config.publicPath
});
const lanIp = address.ip();
let lanUrl;
if (isLocal && isPrivateIP(lanIp)) {
  lanUrl = url.format({
    protocol: 'http',
    hostname: lanIp,
    port: config.port,
    pathname: config.publicPath
  });
}

let compiler;

try {
  compiler = webpack(configFactory('development'));
} catch (err) {
  console.error(err);
  process.exit(1);
}

compiler.hooks.invalid.tap('invalid', () => {
  console.log('Compiling...');
});

compiler.hooks.done.tap('done', async stats => {
  const statsData = stats.toJson({
    all: false,
    error: true,
    warnings: true
  });

  console.log(statsData);

  console.log(chalk.green('Compiled successfully!'));
  console.log();
  console.log(`You can now view ${chalk.bold(appName)} in the browser.`);
  console.log();
  console.log(`- ${chalk.bold('Local:')}    ${chalk.cyan(localUrl)}`);
  lanUrl && console.log(`- ${chalk.bold('Network:')}  ${chalk.cyan(lanUrl)}`);
  console.log();
});

const server = new WebpackDevServer(compiler, devServerConfig);

server.listen(config.port, '0.0.0.0', error => {
  if (error) {
    return console.log(error);
  }

  console.log(chalk.cyan('Starting the development server...\n'));

  ['SIGINT', 'SIGTERM'].forEach(function (sig) {
    process.on(sig, function () {
      server.close();
      process.exit();
    });
  });
});
