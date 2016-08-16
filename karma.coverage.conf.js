var base = require('./karma.base.js');
var _ = require('lodash');
var path = require('path');

module.exports = function(config) {
  var conf = base(config);
  _.merge(conf, {
    reporters: ['mocha', 'coverage'],
    singleRun: true,
    coverageReporter: {
      dir: 'coverage/react',
      reporters: [
        { type: 'html', subdir: 'html' },
        { type: 'lcov', subdir: 'lcov' }
      ]
    }
  });
  // Unable to merge a single browser in this way, because _.merge
  // simple sets conf.browsers[0] to PhantomJS, but leaves the others
  // (Firefox and the original PhantomJS) where they are, so you end up
  // with ['PhantomJS', 'Firefox', 'PhantomJS']. 
  conf.browsers = ['PhantomJS'];
  config.set(conf);
};
