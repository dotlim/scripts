const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
// const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const postcssNormalize = require('postcss-normalize');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const path = require('path');

const paths = require('./paths');
const getClientEnvironment = require('./env');
const config = require('./dotlim.config');

const {
  inlineRuntimeChunk,
  shouldUseSourceMap,
  imageInlineSizeLimit,
  productionCache,
  productionGzip,
} = config.compilerOptions;

// style files regexes
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

module.exports = webpackEnv => {
  const isDevEnv = webpackEnv === 'development';
  const isProdEnv = webpackEnv === 'production';

  const env = getClientEnvironment();

  const getStyleLoaders = (cssOptions, preProcessor) => {
    const loaders = [
      require.resolve('vue-style-loader'),
      isDevEnv && require.resolve('style-loader'),
      isProdEnv && {
        loader: MiniCssExtractPlugin.loader,
        options: {
          publicPath: '../',
        },
      },
      {
        loader: require.resolve('css-loader'),
        options: cssOptions,
      },
      {
        loader: require.resolve('postcss-loader'),
        options: {
          postcssOptions: {
            plugins: [
              require('postcss-flexbugs-fixes'),
              require('postcss-preset-env')({
                autoprefixer: {
                  flexbox: 'no-2009',
                },
                stage: 3,
              }),
              postcssNormalize(),
            ],
            sourceMap: isDevEnv,
          },
        },
      },
    ].filter(Boolean);

    if (preProcessor) {
      loaders.push({
        loader: require.resolve(preProcessor),
        options: {
          sourceMap: false,
        },
      });
    }

    return loaders;
  };

  return {
    mode: isProdEnv ? 'production' : isDevEnv ? 'development' : 'none',
    devtool: isProdEnv ? (shouldUseSourceMap ? 'source-map' : false) : isDevEnv && 'cheap-module-source-map',

    entry: {
      main: paths.appEntry,
    },

    output: {
      path: isProdEnv ? paths.appBuild : paths.appBuild,
      publicPath: config.publicPath,
      pathinfo: isDevEnv,
      filename: isProdEnv ? 'js/[name].[contenthash:8].js' : 'js/[name].js',
      chunkFilename: isProdEnv ? 'js/[name].[contenthash:8].js' : 'js/[name].chunk.js',
      globalObject: 'this',
    },

    module: {
      strictExportPresence: true,
      rules: [
        // {
        //   parser: { requireEnsure: false },
        // },
        // {
        //   test: /\.(js|mjs|jsx|ts|tsx)$/,
        //   enforce: 'pre',
        //   use: [
        //     {
        //       options: {
        //         cache: true,
        //         formatter: require.resolve('eslint-friendly-formatter'),
        //         eslintPath: require.resolve('eslint'),
        //         resolvePluginsRelativeTo: paths.appSrc,
        //       },
        //       loader: require.resolve('eslint-loader'),
        //     },
        //   ],
        //   include: paths.appSrc,
        // },
        {
          test: /\.(js|jsx|ts|tsx)$/,
          include: paths.appSrc,
          loader: require.resolve('babel-loader'),
          options: {
            cacheDirectory: isProdEnv && productionCache,
            cacheCompression: false,
            compact: isProdEnv,
          },
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader',
        },
        {
          oneOf: [
            {
              test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
              loader: require.resolve('url-loader'),
              options: {
                limit: imageInlineSizeLimit,
                name: 'media/[name].[hash:8].[ext]',
              },
            },
            {
              test: /\.js$/,
              exclude: /@babel(?:\/|\\{1,2})runtime/,
              loader: require.resolve('babel-loader'),
              options: {
                babelrc: false,
                configFile: false,
                compact: false,
                // presets:
                cacheDirectory: isProdEnv && productionCache,
                cacheCompression: false,
                sourceMaps: shouldUseSourceMap,
                inputSourceMap: shouldUseSourceMap,
              },
            },
            {
              test: cssRegex,
              exclude: cssModuleRegex,
              use: getStyleLoaders({
                esModule: false,
                importLoaders: 1,
                sourceMap: isProdEnv ? shouldUseSourceMap : isDevEnv,
              }),
              sideEffects: true,
            },
            {
              test: sassRegex,
              exclude: sassModuleRegex,
              use: getStyleLoaders(
                {
                  esModule: false,
                  importLoaders: 3,
                  sourceMap: isProdEnv ? shouldUseSourceMap : isDevEnv,
                },
                'sass-loader'
              ),
              sideEffects: true,
            },
            {
              loader: require.resolve('file-loader'),
              exclude: [/\.(js|mjs|jsx|ts|tsx|vue)$/, /\.html$/, /\.json$/],
              options: {
                name: 'media/[name].[hash:8].[ext]',
              },
            },
          ],
        },
      ],
    },

    plugins: [
      isProdEnv && new CleanWebpackPlugin(),

      new HtmlWebpackPlugin(
        Object.assign(
          {},
          {
            inject: true,
            template: paths.appTemplate,
          },
          isProdEnv
            ? {
                minify: {
                  removeComments: true,
                  collapseWhitespace: true,
                  removeRedundantAttributes: true,
                  useShortDoctype: true,
                  removeEmptyAttributes: true,
                  removeStyleLinkTypeAttributes: true,
                  keepClosingSlash: true,
                  minifyJS: true,
                  minifyCSS: true,
                  minifyURLs: true,
                },
              }
            : undefined
        )
      ),

      new VueLoaderPlugin(),

      isProdEnv &&
        new MiniCssExtractPlugin({
          filename: 'css/[name].[contenthash:8].css',
          chunkFilename: 'css/[name].[contenthash:8].chunk.css',
        }),

      // isProdEnv &&
      //   new CopyWebpackPlugin({
      //     patterns: [{ from: paths.appPublic, to: paths.appBuild }],
      //   }),

      isProdEnv &&
        productionGzip &&
        new CompressionWebpackPlugin({
          test: /\.js$|\.css$|\.html$/,
          threshold: 10240,
          deleteOriginalAssets: false,
        }),

      new webpack.DefinePlugin(env.stringified),

      isDevEnv && new webpack.HotModuleReplacementPlugin(),

      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ].filter(Boolean),

    resolve: {
      modules: ['node_modules', paths.appNodeModules],
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue', '.json'],
      alias: {
        '@': paths.appSrc,
      },
    },

    optimization: {
      minimize: isProdEnv,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            parse: {
              ecma: 8,
            },
            compress: {
              ecma: 5,
              warnings: false,
              comparisons: false,
              inline: 2,
            },
            mangle: {
              safari10: true,
            },
            // Added for profiling in devtools
            keep_classnames: false,
            keep_fnames: false,
            output: {
              ecma: 5,
              comments: false,
              ascii_only: true,
            },
            sourceMap: isProdEnv,
          },
          extractComments: false,
        }),

        new CssMinimizerPlugin({
          sourceMap: true,
          minimizerOptions: {
            preset: [
              'default',
              {
                discardComments: {
                  removeAll: true,
                },
              },
            ],
          },
          cache: isDevEnv,
        }),
      ],
      // Automatically split vendor and commons
      splitChunks: {
        chunks: 'all',
        name: false,
      },
      // Keep the runtime chunk separated to enable long term caching
      runtimeChunk: {
        name: entrypoint => `runtime-${entrypoint.name}`,
      },
    },

    // Turn off performance processing because we utilize
    // our own hints via the FileSizeReporter
    performance: false,
  };
};
