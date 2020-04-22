'use strict';

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'development',
  entry: {
    app: './client/app.js'
  },
  output: {
    path: __dirname + '/wwwroot/dist',
    publicPath: '/dist/'
  },
  resolve: {
    modules: [ 'client', 'node_modules' ],
    extensions: [ '.js', '.jsx', '.tsx' ]
  },
  devtool: 'source-map',
  module: {
    rules: [
      { test: /\.jsx?$/, use: 'babel-loader', exclude: /node_modules/ },
      { test: /\.tsx?$/, use: 'awesome-typescript-loader?silent=true' },
      { test: /\.css$/, use: [ MiniCssExtractPlugin.loader, 'css-loader?minimize' ] },
      { test: /\.svg$/, use: 'svg-url-loader?noquotes=true' },
      { test: /\.(png|jpg|jpeg|gif)$/, use: 'url-loader?limit=25000' },
      { test: /\.cvs$/, use: 'url-loader?name=rules/[name].[ext]' }
      /*
      Sezione gestione file video (mp4)
      non serve - la gestione di file statici fuori da wwwroot si fa con 
      { test: /\.mp4$/, use: 'url-loader?name=videos/[name].[ext]' },
      {
        test: /\.(txt|csv|mmdb)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: "rules/[name].[ext]",
              emitFile: true,
            },
          },
        ],
      }
    */
    ]
  },
  plugins: [ new MiniCssExtractPlugin() ]
};

// var glos = require("../../../../../Desktop/Glossario ITA-LIS.csv");
// var st = require("..\\..\\..\\..\\..\\Desktop\StopWords.csv");

// console.log("webpack.config.js - glos: ", glos); // '/build/12as7f9asfasgasg.jpg'
// console.log("webpack.config.js - st: ", st); // '/build/12as7f9asfasgasg.jpg'
