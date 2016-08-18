var webpack = require('webpack');

module.exports = {
  entry: [
    require.resolve('./app/index.js'),
    require.resolve('webpack-dev-server/client') + '?/',
    require.resolve('webpack/hot/dev-server')
  ],
  output: {
    path: __dirname,
    publicPath: '/assets/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: ['babel'],
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react']
        }
      },
      {
        test: /\.less$/,
        loaders: ['style', 'css', 'less']
      },
      { 
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'file'
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
};
