const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');
const path = require('path');
const fs = require('fs');

// 检查project.config.js文件是否存在，不存在就copy一份
function checkProjectConfig() {
  const projectConfigPath = path.resolve(process.cwd(), 'project.config.js');
  if (!fs.existsSync(projectConfigPath)) {
    const src = path.resolve(__dirname, '..', 'files/project.config.example.js');
    fs.copyFileSync(src, projectConfigPath);
  }
}
checkProjectConfig();

const { WebpackDevServerConfig } = require(path.resolve(process.cwd(), 'project.config.js'));
const webpackDevConfig = require('./webpack.dev');
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
