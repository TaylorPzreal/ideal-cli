const { ProgressPlugin, DllReferencePlugin, BannerPlugin } = require('webpack');
const InterpolateWebpackPlugin = require('interpolate-webpack-plugin');
const path = require('path');
const { rootBaseProject, moduleFileExtensions } = require('./config');
const { dllVendors } = require(path.resolve(process.cwd(), 'project.config.js'));

const common = {
  resolve: {
    // TODO: search this
    // modules: ['node_modules'],
    extensions: moduleFileExtensions
  },
  module: {},
  plugins: [
    new ProgressPlugin(),
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

// For Dll
if (dllVendors.length > 0) {
  common.plugins.push(
    new InterpolateWebpackPlugin([{
      key: 'INJECT_DLL',
      value: rootBaseProject('dist/dll*.js'),
      type: 'PATH'
    }]),
    new DllReferencePlugin({
      context: __dirname,
      manifest: rootBaseProject('dist/dll-manifest.json'),
    }),
  )
}

module.exports = {
  common
}
