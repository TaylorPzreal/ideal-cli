const path = require('path');
const postcssNormalize = require('postcss-normalize');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const moduleFileExtensions = [
  'js',
  'jsx',
  'ts',
  'tsx',
  'json',
  'mjs',
  'web.js',
  'web.ts',
  'web.jsx',
  'web.tsx',
  'web.mjs',
];

const rootBaseProject = (...args) => path.join(process.cwd(), ...args);
const cliWorkspace = path.resolve(__dirname, '..');

// 用于dll的第三方库列表
const vendors = [];

// module rules test regex
const moduleRegex = {
  main: /\.(js|jsx|ts|tsx|mjs)$/,
  css: /\.css$/,
  cssModule: /\.module\.css$/,
  sass: /\.(scss|sass)$/,
  sassModule: /\.module\.(scss|sass)$/,
  less: /\.less$/,
  image: /\.(png|jpe?g|gif|bmp)$/,
};

const constants = {
  IMAGE_INLINE_SIZE_LIMIT: 10000
};

// common function to get style loaders
const getStyleLoaders = (useSourceMap, cssOptions, preProcessor) => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isProduction = process.env.NODE_ENV === 'production';

  const loaders = [
    isDevelopment && require.resolve('style-loader'),
    isProduction && {
      loader: MiniCssExtractPlugin.loader,
      // css is located in `assets/css`, use '../../' to locate index.html folder
      // in production `paths.publicUrlOrPath` can be a relative path
      // options: paths.publicUrlOrPath.startsWith('.')
      //   ? { publicPath: '../../' }
      //   : {},
    },
    {
      loader: require.resolve('css-loader'),
      options: cssOptions,
    },
    {
      // Options for PostCSS as we reference these options twice
      // Adds vendor prefixing based on your specified browser support in
      // package.json
      loader: require.resolve('postcss-loader'),
      options: {
        // Necessary for external CSS imports to work
        // https://github.com/facebook/create-react-app/issues/2677
        ident: 'postcss',
        plugins: () => [
          require('postcss-flexbugs-fixes'),
          require('postcss-preset-env')({
            autoprefixer: {
              flexbox: 'no-2009',
            },
            stage: 3,
          }),
          // Adds PostCSS Normalize as the reset css with default options,
          // so that it honors browserslist config in package.json
          // which in turn let's users customize the target behavior as per their needs.
          postcssNormalize(),
        ],
        sourceMap: isProduction && useSourceMap,
      },
    },
  ].filter(Boolean);
  if (preProcessor) {
    loaders.push(
      {
        loader: require.resolve('resolve-url-loader'),
        options: {
          sourceMap: isProduction && useSourceMap,
        },
      },
      {
        loader: require.resolve(preProcessor),
        options: {
          sourceMap: true,
        },
      }
    );
  }
  return loaders;
};

module.exports = {
  moduleFileExtensions,
  vendors,
  cliWorkspace,
  rootBaseProject,
  moduleRegex,
  constants,
  getStyleLoaders,
};
