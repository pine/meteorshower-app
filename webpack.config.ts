import { join } from 'path'
import * as webpack from 'webpack'

const isWatch = process.argv.indexOf('--watch') > -1
const plugins = [
  new webpack.DefinePlugin({
    DEBUG: JSON.stringify(isWatch),
  }),
  new webpack.NormalModuleReplacementPlugin(
    /sinon/,
    `${__dirname}/node_modules/sinon/pkg/sinon.js`
  ),
]

if (!isWatch) {
  plugins.push(
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false },
      sourceMap: false,
    })
  )
}

// ----------------------------------------------------------------------------

const configuration: webpack.Configuration = {
  context: __dirname,
  entry: {
    'background': './src/background',
    'content_scripts': './src/content_scripts',
    'options_page': './src/options_page',
  },
  output: {
    path: join(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', 'jsx'],
    alias: {
      'sinon': 'sinon/pkg/sinon',
      'vue': 'vue/dist/vue.esm.js',
    },
  },
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
  plugins,
  watchOptions: {
    poll: true,
  },
}

module.exports = configuration

// vim: se et ts=2 sw=2 sts=2 ft=typescript :
