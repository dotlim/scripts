process.env.NODE_ENV = 'production';
process.env.BABEL_ENV = 'production';

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const chalk = require('chalk');
const configFactory = require('../config/webpack.config');
const paths = require('../config/paths');

// main

console.log(chalk.cyan('Creating an optimized production build...\n'));

let compiler;

try {
  compiler = webpack(configFactory('production'));
} catch (err) {
  console.error(err);
  process.exit(1);
}

compiler.run((error, stats) => {
  if (error) {
    return console.log(error);
  }

  console.log(
    stats.toString({
      all: false,
      errors: true,
      warnings: true,
      assets: true,
      colors: true
    })
  );
});
