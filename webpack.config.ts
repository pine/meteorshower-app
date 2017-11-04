import * as webpack from 'webpack'

const isWatch = process.argv.indexOf('--watch') > -1
const plugins = [
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
    'content_scripts': './src/content_scripts',
  },
  output: {
    filename: './dist/[name].bundle.js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', 'jsx'],
    alias: {
      'sinon': 'sinon/pkg/sinon',
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
    ],
  },
  plugins,
  watchOptions: {
    poll: true,
  },
}

module.exports = configuration

// vim: se et ts=2 sw=2 sts=2 ft=typescript :
