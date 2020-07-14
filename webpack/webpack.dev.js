const HtmlWebpackPlugin = require('html-webpack-plugin');
const { merge } = require('webpack-merge');
const path = require('path');
const { entry, output, HtmlWebpackPluginConfig, useSourceMap } = require(path.resolve(process.cwd(), 'project.config.js'));

process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

process.on('unhandledRejection', err => {
  console.log('------ Promise unhandled rejection ------');
  throw err;
})

const { common } = require('./webpack.common');
const getRules = require('./rules');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  entry: {
    ...entry,
  },
  output: {
    filename: '[name].[hash].js',
    chunkFilename: '[name].chunk.js',
    hashDigest: 'hex',
    hashDigestLength: 20,
    ...output,
  },
  module: {
    rules: getRules(useSourceMap),
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      ...HtmlWebpackPluginConfig,
    }),
  ],
  performance: {
    hints: false,
  }
});
