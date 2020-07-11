const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');
const path = require('path');
const webpackDevConfig = require('./webpack.dev');
const { WebpackDevServerConfig } = require(path.resolve(process.cwd(), 'project.config.js'))

const webpackProdConfig = require('./webpack.prod');
const webpackLibConfig = require('./webpack.lib');

function init(command) {
  switch(command) {
    case 'start': {
      const devServerConfig = Object.assign({
        hot: true,
        overlay: true,
      }, WebpackDevServerConfig);

      const server = new webpackDevServer(webpack(webpackDevConfig), devServerConfig);

      server.listen(devServerConfig.port, devServerConfig.host, (error) => {
        if (error) {
          console.log(error);
          return;
        }
        console.log('****** WebServer started! ******')
      });
      break;
    }
    case 'build':
      webpack(webpackProdConfig).run((err) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log('****** Webpack build successfully! ******');
      });
      break;
    case 'build-lib':
      webpack(webpackLibConfig).run((err) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log('****** Webpack build library successfully! ******');
      })
      break;
    default:
      console.log('Command not defined: ', command);
  }
}

module.exports = init;
