const { ProgressPlugin, DllReferencePlugin, BannerPlugin } = require('webpack');
const InterpolateWebpackPlugin = require('interpolate-webpack-plugin');

const { moduleFileExtensions, rootBaseProject } = require('./config');

exports.common = {
  entry: {
    app: rootBaseProject('src/index.jsx')
  },
  resolve: {
    modules: ['node_modules'],
    extensions: moduleFileExtensions
  },
  module: {
  },
  plugins: [
    new ProgressPlugin(),

    new InterpolateWebpackPlugin([{
      key: 'INJECT_DLL',
      value: rootBaseProject('dll/*.js'),
      type: 'PATH'
    }]),

    new DllReferencePlugin({
      context: __dirname,
      manifest: rootBaseProject('dll/vendor-manifest.json'),
    }),

    new BannerPlugin('©2017-2020 honeymorning.com taylorpzreal@gmail.com')
  ],
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
