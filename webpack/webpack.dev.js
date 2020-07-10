const { NamedModulesPlugin } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');

const { common } = require('./webpack.common');
const { rootBaseProject, moduleRegex, constants } = require('./config');

module.exports = merge(common, {
  mode: 'development',
  devtool: '#@cheap-module-source-map',
  output: {
    pathinfo: true,
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js',
    path: rootBaseProject('dist'),
    publicPath: '/',
  },
  module: {
    // TODO: learn this.
    strictExportPresence: true,
    rules: [
      {
        oneOf: [
          {
            test: moduleRegex.image,
            loader: require.resolve('url-loader'),
            options: {
              limit: constants.IMAGE_INLINE_SIZE_LIMIT,
              name: 'assets/[name].[hash:8].[ext]'
            }
          },
          {
            test: moduleRegex.main,
            include: [],
            loader: require.resolve('babel-loader'),
            options: {
              customize: require.resolve(
                'babel-preset-react-app/webpack-overrides'
              ),

              plugins: [
                [
                  require.resolve('babel-plugin-named-asset-import'),
                  {
                    loaderMap: {
                      svg: {
                        ReactComponent:
                          '@svgr/webpack?-svgo,+titleProp,+ref![path]',
                      },
                    },
                  },
                ],
              ],

              cacheDirectory: true,
              cacheCompression: false,
              compact: isEnvProduction,
            }
          },
          {
            test: /\.(js|mjs)$/,
            exclude: /@babel(?:\/|\\{1,2})runtime/,
            loader: require.resolve('babel-loader'),
            options: {
              babelrc: false,
              configFile: false,
              compact: false,
              presets: [
                [
                  require.resolve('babel-preset-react-app/dependencies'),
                  { helpers: true },
                ],
              ],
              cacheDirectory: true,
              // See #6846 for context on why cacheCompression is disabled
              cacheCompression: false,

              // Babel sourcemaps are needed for debugging into node_modules
              // code.  Without the options below, debuggers like VSCode
              // show incorrect code and set breakpoints on the wrong lines.
              sourceMaps: shouldUseSourceMap,
              inputSourceMap: shouldUseSourceMap,
            },
          },
          {
            test: moduleRegex.css,
            exclude: moduleRegex.cssModule,
            use: [],
            sideEffects: true,
          },
          {
            test: moduleRegex.sass,
            exclude: moduleRegex.sassModule,
            use: []
          },
          {
            loader: require.resolve('file-loader'),
            exclude: [moduleRegex.main, /\.html$/, /\.json$/],
            options: {
              name: 'assets/[name].[hash:8].[ext]',
            },
          },
        ]
      }
    ],
  },
  plugins: [
    new NamedModulesPlugin(),

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
