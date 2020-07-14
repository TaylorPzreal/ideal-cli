const path = require('path');
const postcssNormalize = require('postcss-normalize');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const moduleFileExtensions = [
  '.jsx',
  '.js',
  '.tsx',
  '.ts',
  '.json',
];

const rootBaseProject = (...args) => path.resolve(process.cwd(), ...args);

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

const babelPlugins = [
  '@babel/plugin-proposal-export-namespace-from',
  '@babel/plugin-proposal-function-sent',
  '@babel/plugin-proposal-json-strings',
  '@babel/plugin-proposal-numeric-separator',
  '@babel/plugin-proposal-throw-expressions',
  '@babel/plugin-syntax-dynamic-import',
  '@babel/plugin-syntax-import-meta',
  '@babel/plugin-transform-runtime',
  '@babel/plugin-proposal-class-properties'
]

const browserCompatibilityPreset = [
  '@babel/preset-env',
  {
      debug: true,
      useBuiltIns: 'usage',
      corejs: 3,
      modules: false,
  }
]

module.exports = {
  moduleFileExtensions,
  rootBaseProject,
  moduleRegex,
  constants,
  getStyleLoaders,
  babelPlugins,
  browserCompatibilityPreset,
};
