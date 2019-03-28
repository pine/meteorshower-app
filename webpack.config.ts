'use strict'

import { join } from 'path'
import * as webpack from 'webpack'
import * as UglifyJsPlugin from 'uglifyjs-webpack-plugin'

const isDev = process.argv.includes('--watch')
const mode = isDev ? 'development' : 'production'

// ----------------------------------------------------------------------------

const configuration: webpack.Configuration = {
  mode,

  // Entry and Context
  //~~~~~~~~~~~~~~~~~~~~~~~
  context: __dirname,
  entry: {
    'background': './src/background',
    'content_scripts': './src/content_scripts',
    'options_page': './src/options_page',
  },

  // Output
  //~~~~~~~~~~
  output: {
    path: join(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },

  // Module
  //~~~~~~~~~~~
  module: {
    noParse: [ /sinon/ ],
    rules: [
      {
        test: /sinon.*\.js$/,
        use: 'imports-loader?define=>false,require=>false',
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
      },
      {
        test: /\.json$/,
        use: 'json-loader',
      },
      {
        test: /\.css/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
        ],
      },
      {
        test: /\.scss/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'sass-loader' },
        ],
      },
      {
        test: /\.html/,
        use: 'html-loader',
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
        loader: 'file-loader',
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?\S*)?$/,
        loader: 'file-loader',
        query: {
          name: '[name].[ext]?[hash]'
        },
      }
    ],
  },

  // Resolve
  //~~~~~~~~~~~
  resolve: {
    extensions: ['.ts', '.tsx', '.js', 'jsx'],
    alias: {
      'sinon': 'sinon/pkg/sinon',
      'vue': 'vue/dist/vue.esm.js',
    },
  },

  // Optimization and Plugins
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        parallel: true,
        sourceMap: false,
      }),
      new webpack.optimize.AggressiveMergingPlugin(),
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      DEBUG: JSON.stringify(isDev),
    }),
    new webpack.NormalModuleReplacementPlugin(
      /sinon/,
      `${__dirname}/node_modules/sinon/pkg/sinon.js`
    ),
  ],

  // Watch and WatchOptions
  //~~~~~~~~~~~~~~~~~~~~~~~~~
  watchOptions: {
    poll: true,
  },

  // Performance
  //~~~~~~~~~~~~~~~
  performance: {
    hints: false,
  },

  // Stats
  //~~~~~~~~
  stats: {
    entrypoints: true,
    children: false,
    chunks: false,
    chunkModules: false,
    chunkOrigins: false,
    colors: true,
    modules: false,
  },
}

module.exports = configuration

// vim: se et ts=2 sw=2 sts=2 ft=typescript :
