const path = require('path');

module.exports = {
  entry: {
    app: path.resolve(__dirname, 'src/index'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  externals: [],
  resolve: {},
  HtmlWebpackPluginConfig: {
    template: path.resolve(__dirname, 'src/index.html'),
  },
  WebpackDevServerConfig: {
    historyApiFallback: true,
    host: '127.0.0.1',
    port: 8080,
  },
};
