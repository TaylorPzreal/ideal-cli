const { ProgressPlugin, DllReferencePlugin, BannerPlugin } = require('webpack');
const InterpolateWebpackPlugin = require('interpolate-webpack-plugin');
const path = require('path');
const { rootBaseProject, moduleFileExtensions } = require('./config');
const { dllVendors, resolve, output } = require(path.resolve(process.cwd(), 'project.config.js'));

const common = {
  resolve: {
    // 告诉 webpack 解析模块时应该搜索的目录
    modules: ['node_modules'],
    // 尝试按顺序解析这些后缀名。
    extensions: moduleFileExtensions,
    ...resolve,
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
    // new InterpolateWebpackPlugin([{
    //   key: 'INJECT_DLL',
    //   value: rootBaseProject(`${output.path}/dll*.js`),
    //   type: 'PATH'
    // }]),
    new DllReferencePlugin({
      context: __dirname,
      manifest: rootBaseProject(`${output.path}/dll-manifest.json`),
    }),
  )
}

module.exports = {
  common
}
