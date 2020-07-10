const webpack = require('webpack')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const getRules = require('./rules')
const { moduleFileExtensions } = require('./config')
const project = require(require.resolve(process.cwd() + '/project.config'))
const basePath = project.basePath || process.cwd()
const useSourceMap = project.useSourceMap || true

const params = process.argv.splice(2)
const customMode = project.mode || (params.find(item => (item.split('=')[0] === '--mode')) || '').split('=')[1]

module.exports = {
    mode: ['production', 'development'].includes(customMode) ? customMode : 'production',
    entry: {
        app: [
            path.resolve(basePath, project.entry || './src/index.js')
        ]
    },
    output: {
        library: 'lib',
        libraryTarget: 'amd',
        filename: 'index.js',
        path: path.resolve(basePath, project.outDir || 'lib'),
        publicPath: project.publicPath
    },
    devtool: 'source-map',
    externals: project.externals || [],
    module: {
        rules: getRules(useSourceMap),
    },
    resolve: {
        extensions: moduleFileExtensions,
    },
    plugins: [
        new webpack.DefinePlugin({
            __DEV__: false
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash:8].css',
            chunkFilename: '[name].[contenthash:8].chunk.css'
        }),
        new CleanWebpackPlugin({ verbose: true })
    ]
}
