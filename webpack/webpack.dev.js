const HtmlWebpackPlugin = require('html-webpack-plugin');
const { merge } = require('webpack-merge');

const { common } = require('./webpack.common');
const { rootBaseProject } = require('./config');
const getRules = require('./rules');

const useSourceMap = false;

module.exports = merge(common, {
  mode: 'development',
  devtool: 'cheap-module-source-map',

  output: {
    pathinfo: true,
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js',
    path: rootBaseProject('dist'),
    publicPath: '/',
  },
  module: {
    rules: getRules(useSourceMap),
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: 'src/index.html'
    }),
  ],
  devServer: {
    historyApiFallback: true,
    port: 8080
  },
  performance: {
    hints: false,
  }
});
