var baseConf = require('./karma.conf.js');

baseConf.reporters.push('coverage');
baseConf.preprocessors['client/**/*.js'].unshift('coverage');

module.exports = baseConf;
