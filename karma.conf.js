var base = require('./karma.base.js');

module.exports = function(config) {
  var conf = base(config);
  config.set(conf);
};
