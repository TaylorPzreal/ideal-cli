const { DllPlugin, ProgressPlugin } = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');
const { rootBaseProject, moduleFileExtensions } = require('./config');
const { dllVendors } = require(path.resolve(process.cwd(), 'project.config.js'));

module.exports = {
  mode: 'production',
  entry: {
    dll: dllVendors
  },
  output: {
    path: rootBaseProject('dist'),
    filename: '[name].[contenthash].js',
    library: '[name]_[chunkhash]'
  },
  resolve: {
    extensions: moduleFileExtensions,
  },
  plugins: [
    new ProgressPlugin(),

    new DllPlugin({
      path: rootBaseProject('dist/[name]-manifest.json'),
      name: '[name]_[chunkhash]',
      context: __dirname
    }),
  ],
  optimization: {
    minimize: true,
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
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
          },
        },
        sourceMap: false,
      }),
    ],
  },
};
