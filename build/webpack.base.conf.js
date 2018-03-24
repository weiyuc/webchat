'use strict'
const webpack = require('webpack')
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    entry: {
        app: './src/main.js'
    },
    output: {
        path: config.build.assetsRoot,
        filename: '[name].js',
        publicPath: process.env.NODE_ENV === 'production'
            ? config.build.assetsPublicPath
            : config.dev.assetsPublicPath
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': resolve('src'),
        }
    },
    module: {
        rules: [{
            test: /\.vue$/,
            loader: 'vue-loader',
            options: {
                loaders: {
                    'scss': 'vue-style-loader!css-loader!sass-loader',
                    'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax',
                }
            }
        }, {
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/
        }, {
            test: /\.(png|jpg|gif|svg)$/,
            loader: 'file-loader',
            options: {
                name: 'images/[name].[ext]?[hash]'
            }
        }, {
            test: /\.(eot(|\?v=.*)|woff(|\?v=.*)|woff2(|\?v=.*)|ttf(|\?v=.*))$/,
            loader: 'file-loader',
            options: {
                name: 'fonts/[name].[ext]?[hash]'
            }
        }, {
            test: /\.swf$/,
            loader: 'file-loader',
            options: {
                name: 'swfs/[name].[ext]?[hash]'
            }
        }]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            "window.jQuery": 'jquery'
        })
    ]
}
