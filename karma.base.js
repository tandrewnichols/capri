var path = require('path');
var appSrc = path.resolve(__dirname, 'client/');

module.exports = function(config) {
  return {
    // ... normal karma configuration
    files: [
      'test/react/index.js'
    ],

    frameworks: ['mocha'],
    reporters: ['mocha'],
    browsers: ['Chrome', 'Firefox', 'PhantomJS'],

    preprocessors: {
      'test/react/index.js': ['webpack']
    },

    logLevel: config.LOG_WARN,

    webpack: {
      module: {
        loaders: [
          {
            test: /\.json$/,
            loader: 'json'
          },
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
            loader: 'ignore'
          }
        ]
      },
      resolve: {
        extentions: ['', '.js', '.json'],
        alias: {
          src: appSrc,
          components: appSrc + 'components'
        }
      },
      externals: {
        'react/lib/ExecutionEnvironment': true,
        'react/addons': true,
        'react/lib/ReactContext': 'window'
      }
    },

    webpackMiddleware: {
      noInfo: true
    }
  };
};
