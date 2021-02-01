const fs = require('fs');
const paths = require('./paths');

const NODE_ENV = process.env.NODE_ENV;
if (!NODE_ENV) {
  throw new Error('The NODE_ENV environment variable is required but was not specified.');
}

const dotenvFiles = [`${paths.dotenv}.${NODE_ENV}.local`, `${paths.dotenv}.${NODE_ENV}`, paths.dotenv];

// Load environment variables from .env* files. Suppress warnings using silent
// if this file is missing. dotenv will never modify any environment variables
// that have already been set.  Variable expansion is supported in .env files.
dotenvFiles.forEach(dotenvFile => {
  if (fs.existsSync(dotenvFile)) {
    require('dotenv-expand')(
      require('dotenv').config({
        path: dotenvFile,
      })
    );
  }
});

// Grab NODE_ENV and DOTLIM_APP_* environment variables and prepare them to be
// injected into the application via DefinePlugin in webpack configuration.
const DOTLIM_APP = /^DOTLIM_APP_/i;

const getClientEnvironment = () => {
  const raw = Object.keys(process.env)
    .filter(key => DOTLIM_APP.test(key))
    .reduce(
      (env, key) => {
        env[key] = process.env[key];
        return env;
      },
      {
        // Useful for determining whether we’re running in production mode.
        // Most importantly, it switches React into the correct mode.
        NODE_ENV: process.env.NODE_ENV || 'development',
      }
    );

  // Stringify all values so we can feed into webpack DefinePlugin
  const stringified = {
    'process.env': Object.keys(raw).reduce((env, key) => {
      env[key] = JSON.stringify(raw[key]);
      return env;
    }, {}),
  };

  return { raw, stringified };
};

module.exports = getClientEnvironment;
