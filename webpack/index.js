const webpack = require('webpack');
const webpackDevConfig = require('./webpack.dev');
// const webpackProdConfig = require('./webpack.prod');
// const webpackLibConfig = require('./webpack.lib');

function init(command) {
  switch(command) {
    case 'start':
      webpack(webpackDevConfig).run((err, stats) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log(stats);
      });
      break;
    case 'build':
      // webpack(webpackProdConfig).run((err, stats) => {
      //   if (err) {
      //     console.log(err);
      //     return;
      //   }
      //   console.log(stats);
      // });
      break;
    case 'build-lib':
      // webpack(webpackLibConfig).run((err, stats) => {
      //   if (err) {
      //     console.log(err);
      //     return;
      //   }
      //   console.log(stats);
      // })
      break;
    default:
      console.log('Command not defined: ', command);
  }
}

module.exports = init;
