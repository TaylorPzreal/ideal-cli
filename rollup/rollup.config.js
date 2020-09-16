import typescript from 'rollup-plugin-typescript2';
import {terser} from 'rollup-plugin-terser';
import babel from 'rollup-plugin-babel';
import json from '@rollup/plugin-json';

const baseOpts = {
  input: 'src/index.ts',
  watch: {
    clearScreen: false,
  },
};

const configurePlugins = ({module}) => {
  return [
    json(),
    typescript(),
    babel({
      presets: [['@babel/preset-env', {
        targets: {
          browsers: ['chrome 68'],
        },
      }]],
      extensions: ['.ts'],
    }),
    terser({
      module,
      mangle: true,
      compress: true,
    }),
  ]
}

export default [
  {
    ...baseOpts,
    output: {
      format: 'esm',
      // file: './dist/index.es.js',
      dir: './dist',
    },
    plugins: configurePlugins({module: true}),
  },
  // {
  //   ...baseOpts,
  //   output: {
  //     format: 'umd',
  //     // file: './dist/index.umd.js',
  //     dir: './dist',
  //     name: 'SmartChart',
  //   },
  //   plugins: configurePlugins({module: false}),
  // },
];
