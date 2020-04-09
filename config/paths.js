const path = require('path');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

module.exports = {
  // dotenv
  dotenv: resolveApp('.env'),
  // root
  appRoot: appDirectory,
  // project dir
  appPath: resolveApp('.'),
  // output dir
  appBuild: resolveApp('build'),
  // public dir
  appPublic: resolveApp('public'),
  // node_modules dir
  appNodeModules: resolveApp('node_modules'),
  // entey html template
  appHtml: resolveApp('public/index.html'),
  // package.json
  appPackageJson: resolveApp('package.json'),
  // src dir
  appSrc: resolveApp('src'),
  // entry files
  appIndexJs: resolveApp('src/index.js')
};
