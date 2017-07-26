var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');

module.exports = webpackMerge(commonConfig, {
    devtool: 'cheap-module-eval-source-map',

    output: {
        path: helpers.root('dist'),
        publicPath: '/',
        filename: '[name].js',
        chunkFilename: '[id].chunk.js'
    },

    plugins: [
        new ExtractTextPlugin('[name].css')
       
    ],

    devServer: {
        historyApiFallback: true,
        stats: 'minimal',
        /*webpack代理Api*/
        proxy: {
             '/ipharmacare-distributed-yb-web/*': {
          		target: 'http://10.1.2.248:8080', 
//                 target: 'http://10.1.3.32:8080',//于浩
//                 target:'http://192.168.4.101',//曹
                //target: 'http://10.1.3.99:8080',
                // target:'http://112.124.98.224:8080/',
                // target: 'http://192.168.3.127:8081',//吴剑
                // target: 'http://10.1.3.120:8081',//建勇
                // target: 'http://127.0.0.1:8081',
//            		target: 'http://10.1.2.164:8080',
//          	target: 'http://10.1.2.37:8080',
                secure: false

            }
        }
    }
});