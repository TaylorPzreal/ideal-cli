const { moduleRegex, constants, getStyleLoaders, browserCompatibilityPreset, babelPlugins } = require('./config');
const path = require('path');

function getRules(useSourceMap) {
  const isProduction = process.env.NODE_ENV === 'production';

  return [
    {
      oneOf: [
        {
          test: moduleRegex.image,
          loader: require.resolve('url-loader'),
          options: {
            limit: constants.IMAGE_INLINE_SIZE_LIMIT,
            name: 'assets/images/[name].[contenthash].[ext]'
          }
        },
        {
          test: moduleRegex.main,
          include: path.resolve(process.cwd(), 'src'),
          exclude: /node_modules/,
          loader: require.resolve('babel-loader'),
          options: {
            customize: require.resolve(
              'babel-preset-react-app/webpack-overrides'
            ),

            presets: [
              browserCompatibilityPreset,
            ],
  
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
              ...babelPlugins,
            ],
  
            cacheDirectory: true,
            cacheCompression: false,
            compact: isProduction,
          }
        },
        {
          test: /\.(js|mjs)$/,
          exclude: [
            /@babel(?:\/|\\{1,2})runtime/,
            /[/\\]core-js/,
          ],
          loader: require.resolve('babel-loader'),
          options: {
            babelrc: false,
            configFile: false,
            compact: false,
            ignore: [/[/\\]core-js/, /@babel[/\\]runtime/],
            presets: [
              [
                require.resolve('babel-preset-react-app/dependencies'),
                { helpers: true },
              ],
              browserCompatibilityPreset,
            ],
            plugins: [
              ...babelPlugins,
            ],
            cacheDirectory: true,
            // See #6846 for context on why cacheCompression is disabled
            cacheCompression: false,
  
            // Babel sourcemaps are needed for debugging into node_modules
            // code.  Without the options below, debuggers like VSCode
            // show incorrect code and set breakpoints on the wrong lines.
            sourceMaps: useSourceMap,
            inputSourceMap: useSourceMap,
          },
        },
        {
          test: moduleRegex.css,
          exclude: moduleRegex.cssModule,
          use: getStyleLoaders(useSourceMap, {
            importLoaders: 1,
            sourceMap: useSourceMap,
          }),
          sideEffects: true,
        },
        {
          test: moduleRegex.sass,
          exclude: moduleRegex.sassModule,
          use: getStyleLoaders(useSourceMap, {
            importLoaders: 3,
            sourceMap: useSourceMap,
          }, 
          'sass-loader'
          )
        },
        {
          test: moduleRegex.less,
          use: getStyleLoaders(useSourceMap, {
            importLoaders: 3,
            sourceMap: useSourceMap,
          },
          'less-loader'
          ),
        },
        {
          loader: require.resolve('file-loader'),
          exclude: [moduleRegex.main, /\.html$/, /\.json$/],
          options: {
            name: 'assets/[name].[contenthash].[ext]',
          },
        },
      ]
    }
  ];  
}

module.exports = getRules;
