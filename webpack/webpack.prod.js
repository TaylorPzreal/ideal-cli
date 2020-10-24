const { EnvironmentPlugin } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { merge } = require('webpack-merge');
const safePostCssParser = require('postcss-safe-parser');
const path = require('path');

const { common } = require('./webpack.common');
const { rootBaseProject } = require('./config');
const getRules = require('./rules');
const { entry, output, HtmlWebpackPluginConfig, useSourceMap } = require(path.resolve(process.cwd(), 'project.config.js'));

// process.env.BABEL_ENV = 'production';
// process.env.NODE_ENV = 'production';

process.on('unhandledRejection', err => {
  console.log('------ Promise unhandled rejection ------');
  throw err;
})

module.exports = merge(common, {
  mode: 'production',
  // 在第一个错误出现时抛出失败结果，而不是容忍它，迫使 webpack 退出其打包过程。
  bail: true,
  devtool: useSourceMap ? 'source-map' : false,
  entry: {
    ...entry,
  },
  output: {
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[chunkhash].chunk.js',
    ...output,
  },
  module: {
    rules: getRules(useSourceMap),
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      },
      // chunksSortMode: (chunk1, chunk2) => {
      //   const orders = ['inline', 'polyfills', 'vendor', 'app'];
      //   const order1 = orders.indexOf(chunk1.names[0]);
      //   const order2 = orders.indexOf(chunk2.names[0]);
      //   if (order1 > order2) {
      //     return 1;
      //   }
      //   if (order1 < order2) {
      //     return -1;
      //   }
      //   return 0;
      // },
      ...HtmlWebpackPluginConfig,
    }),

    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // all options are optional
      filename: 'assets/css/[name].[contenthash].css',
      chunkFilename: 'assets/css/[name].[chunkhash].chunk.css',
      ignoreOrder: false, // Enable to remove warnings about conflicting order
    }),

    new ManifestPlugin({
      fileName: 'app-manifest.json'
    }),

    new BundleAnalyzerPlugin({
      analyzerMode: 'json',
      openAnalyzer: false,
      generateStatsFile: true,
      statsFilename: rootBaseProject('analysis', 'stats.json'),
      reportFilename: rootBaseProject('analysis', 'reports.json'),
    }),

    new EnvironmentPlugin({
      NODE_ENV: 'production',
      DEBUG: false,
    }),
  ],
  optimization: {
    // 允许你通过提供一个或多个定制过的 TerserPlugin 实例， 覆盖默认压缩工具(minimizer)。
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          parse: {
            // We want terser to parse ecma 8 code. However, we don't want it
            // to apply any minification steps that turns valid ecma 5 code
            // into invalid ecma 5 code. This is why the 'compress' and 'output'
            // sections only apply transformations that are ecma 5 safe
            // https://github.com/facebook/create-react-app/pull/4234
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            // Disabled because of an issue with Uglify breaking seemingly valid code:
            // https://github.com/facebook/create-react-app/issues/2376
            // Pending further investigation:
            // https://github.com/mishoo/UglifyJS2/issues/2011
            comparisons: false,
            // Disabled because of an issue with Terser breaking valid code:
            // https://github.com/facebook/create-react-app/issues/5250
            // Pending further investigation:
            // https://github.com/terser-js/terser/issues/120
            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          // Added for profiling in devtools
          // keep_classnames: isEnvProductionProfile,
          // keep_fnames: isEnvProductionProfile,
          output: {
            ecma: 5,
            comments: false,
            // Turned on because emoji and regex is not minified properly using default
            // https://github.com/facebook/create-react-app/issues/2488
            ascii_only: true,
          },
        },
        sourceMap: useSourceMap,
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          parser: safePostCssParser,
          map: useSourceMap
            ? {
                // `inline: false` forces the sourcemap to be output into a
                // separate file
                inline: false,
                // `annotation: true` appends the sourceMappingURL to the end of
                // the css file, helping the browser find the sourcemap
                annotation: true,
              }
            : false,
        },
        cssProcessorPluginOptions: {
          preset: ['default', { minifyFontValues: { removeQuotes: false } }],
        },
      }),
    ],
    // 对于动态导入模块，默认使用 webpack v4+ 提供的全新的通用分块策略(common chunk strategy)
    splitChunks: {
      chunks: 'all',
      name: false,
    },
    runtimeChunk: {
      name: entrypoint => `runtime-${entrypoint.name}`,
    },
    sideEffects: true,
  },
  performance: {
    hints: 'warning',
  },
  parallelism: 100,
  profile: true,
  recordsPath: rootBaseProject('analysis', 'records.json'),
});
