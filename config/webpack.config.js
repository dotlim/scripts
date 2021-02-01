const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
// const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const postcssNormalize = require('postcss-normalize');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const paths = require('./paths');
const getClientEnvironment = require('./env');
const config = require('./dotlim.config');

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
      isProdEnv && MiniCssExtractPlugin.loader,
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

    entry: {
      main: paths.appIndexJs,
    },

    output: {
      path: isProdEnv ? paths.appBuild : paths.appBuild,
      pathinfo: isDevEnv,
      filename: isProdEnv ? 'js/[name].[contenthash:8].js' : 'js/[name].js',
      chunkFilename: isProdEnv ? 'js/[name].[contenthash:8].js' : 'js/[name].chunk.js',
      globalObject: 'this',
    },

    module: {
      strictExportPresence: true,
      rules: [
        {
          test: cssRegex,
          exclude: cssModuleRegex,
          use: getStyleLoaders({
            esModule: false,
            importLoaders: 1,
            sourceMap: isDevEnv,
          }),
        },
        {
          test: sassRegex,
          exclude: sassModuleRegex,
          use: getStyleLoaders(
            {
              esModule: false,
              importLoaders: 3,
              sourceMap: isDevEnv,
            },
            'sass-loader'
          ),
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader',
        },
      ],
    },

    plugins: [
      isProdEnv && new CleanWebpackPlugin(),

      new HtmlWebpackPlugin({
        inject: true,
        template: paths.appTemplate,
      }),

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

      new webpack.DefinePlugin(env.stringified),

      isDevEnv && new webpack.HotModuleReplacementPlugin(),
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
  };
};
