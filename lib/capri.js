var express = require('express');
var http = require('http');
var chalk = require('chalk');

exports.run = function(options) {
  var app = express();
  app.set('port', options.port || '3131');

  var server = http.createServer(app);
  server.listen(app.get('port'), function() {
    console.log(chalk.cyan('Capri listening on port ' + app.get('port')));
  });
};
