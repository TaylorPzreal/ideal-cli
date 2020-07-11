const HtmlWebpackPlugin = require('html-webpack-plugin');
const { merge } = require('webpack-merge');
const path = require('path');
const { entry, output, HtmlWebpackPluginConfig } = require(path.resolve(process.cwd(), 'project.config.js'));

process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

process.on('unhandledRejection', err => {
  console.log('------ Promise unhandled rejection ------');
  throw err;
})

const { common } = require('./webpack.common');
const { rootBaseProject } = require('./config');
const getRules = require('./rules');

const useSourceMap = false;

module.exports = merge(common, {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  entry: {
    'polyfills': ['core-js/stable', 'regenerator-runtime/runtime'],
    ...entry,
  },
  output: {
    filename: '[name].[hash].js',
    chunkFilename: '[id].chunk.js',
    path: rootBaseProject('dist'),
    hashDigest: 'hex',
    hashDigestLength: 20,
    publicPath: '/',
    ...output,
  },
  module: {
    rules: getRules(useSourceMap),
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: 'src/index.html',
      ...HtmlWebpackPluginConfig,
    }),
  ],
  performance: {
    hints: false,
  }
});
