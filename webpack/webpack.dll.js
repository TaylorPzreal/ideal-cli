const { DllPlugin, ProgressPlugin } = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const { vendors, rootBaseProject } = require('./config');

module.exports = {
  mode: 'production',
  output: {
    path: rootBaseProject('dll'),
    filename: '[name].[chunkhash].dll.js',
    library: '[name]_[chunkhash]'
  },
  entry: {
    vendor: vendors
  },
  plugins: [
    new ProgressPlugin(),

    new DllPlugin({
      path: rootBaseProject('dll/vendor-manifest.json'),
      name: '[name]_[chunkhash]',
      context: __dirname
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
      }),
    ],
  },
};
