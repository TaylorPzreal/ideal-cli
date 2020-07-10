const { HashedModuleIdsPlugin } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { merge } = require('webpack-merge');
const safePostCssParser = require('postcss-safe-parser');

const { common } = require('./webpack.common');
const { rootBaseProject } = require('./config');
const getRules = require('./rules');

const useSourceMap = false; // should use source map

module.exports = merge(common, {
  mode: 'production',
  bail: true,
  recordsPath: rootBaseProject('docs/build-records.json'),
  devtool: useSourceMap ? 'source-map' : false,

  output: {
    filename: '[name].[chunkhash:20].bundle.js',
    chunkFilename: '[name].[chunkhash:20].chunk.js',
    path: rootBaseProject('dist'),
    publicPath: '/'
  },

  module: {
    rules: getRules(useSourceMap),
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['dist/**/*'],
      verbose: true,
      dry: false
    }),

    new CopyPlugin(
      [
        {
          from: rootBaseProject('/dll'),
          to: rootBaseProject('/dist/dll'),
          toType: 'dir'
        },
        {
          from: rootBaseProject('/src/assets'),
          to: rootBaseProject('/dist/assets'),
          toType: 'dir'
        }
      ],
      {
        ignore: ['*.scss', '*.css', '**/fonts/*']
      }
    ),

    new HashedModuleIdsPlugin(),

    new HtmlWebpackPlugin({
      inject: true,
      template: rootBaseProject('src/index.html'),
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
      chunksSortMode: (chunk1, chunk2) => {
        const orders = ['inline', 'polyfills', 'vendor', 'app'];
        const order1 = orders.indexOf(chunk1.names[0]);
        const order2 = orders.indexOf(chunk2.names[0]);
        if (order1 > order2) {
          return 1;
        }
        if (order1 < order2) {
          return -1;
        }
        return 0;
      }
    }),

    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // all options are optional
      filename: 'assets/css/[name].[contenthash:8].css',
      chunkFilename: 'assets/css/[name].[contenthash:8].chunk.css',
      ignoreOrder: false, // Enable to remove warnings about conflicting order
    }),

    new ManifestPlugin({
      fileName: 'app-manifest.json'
    })
  ],
  optimization: {
    minimize: true,
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
    splitChunks: {
      chunks: 'all',
      name: false,
    },
    runtimeChunk: {
      name: entrypoint => `runtime-${entrypoint.name}`,
    },
  },
});
