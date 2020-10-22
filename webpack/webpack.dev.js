const HtmlWebpackPlugin = require('html-webpack-plugin');
const { merge } = require('webpack-merge');
const path = require('path');
const InterpolateWebpackPlugin = require('interpolate-webpack-plugin');
const { entry, output, HtmlWebpackPluginConfig, useSourceMap, dllVendors } = require(path.resolve(process.cwd(), 'project.config.js'));
const { rootBaseProject } = require('./config');

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
    // For Dll
    (dllVendors.length > 0) && (() => {
      // should has ancestor folder
      const dllPath = rootBaseProject(`${output.path}/dll*.js`);

      return new InterpolateWebpackPlugin([{
        key: 'INJECT_DLL',
        value: dllPath,
        type: 'PATH'
      }]);
    })(),
  ],
  performance: {
    hints: false,
  }
});
