module.exports = {
  module: {
    loaders: [
      {
        test: /\.less$/,
        loaders: ['style', 'css', 'less']
      },
      { 
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'file'
      }
    ]
  }
}
