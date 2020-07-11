const { ProgressPlugin, DllReferencePlugin, BannerPlugin } = require('webpack');
const InterpolateWebpackPlugin = require('interpolate-webpack-plugin');

const { moduleFileExtensions, rootBaseProject } = require('./config');

exports.common = {
  resolve: {
    // TODO: search this
    // modules: ['node_modules'],
    extensions: moduleFileExtensions
  },
  module: {
  },
  plugins: [
    new ProgressPlugin(),

    // new InterpolateWebpackPlugin([{
    //   key: 'INJECT_DLL',
    //   value: rootBaseProject('dll/*.js'),
    //   type: 'PATH'
    // }]),

    // new DllReferencePlugin({
    //   context: __dirname,
    //   manifest: rootBaseProject('dll/vendor-manifest.json'),
    // }),

    new BannerPlugin('©2017-2020 honeymorning.com taylorpzreal@gmail.com')
  ],
  optimization: {
    moduleIds: 'hashed',
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
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
