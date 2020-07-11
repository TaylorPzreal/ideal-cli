const path = require("path");
const { DefinePlugin, BannerPlugin } = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const getRules = require("./rules");
const { moduleFileExtensions, rootBaseProject } = require("./config");
const { entry, output, externals = [] } = require(path.resolve(process.cwd(), 'project.config.js'));

const useSourceMap = false;

process.env.BABEL_ENV = "production";
process.env.NODE_ENV = "production";

module.exports = {
  mode: "production",
  entry: {
    ...entry,
  },
  output: {
    library: "lib",
    libraryTarget: "umd",
    filename: "index.js",
    path: rootBaseProject('dist'),
    publicPath: '/',
    globalObject: 'this', //To make UMD build available on both browsers and Node.js, set output.globalObject option to 'this'
    ...output,
  },
  externals: [...externals],
  module: {
    rules: getRules(useSourceMap),
  },
  resolve: {
    extensions: moduleFileExtensions,
  },
  plugins: [
    new DefinePlugin({
      __DEV__: false,
    }),
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css",
      chunkFilename: "[id].[contenthash].chunk.css",
    }),
    new CleanWebpackPlugin(),
    new BannerPlugin('©2017-2020 honeymorning.com taylorpzreal@gmail.com'),
  ],
  optimization: {},
  node: {
    module: 'empty',
    dgram: 'empty',
    dns: 'mock',
    fs: 'empty',
    http2: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  }
};
