#!/usr/bin/env node

var program = require('commander');
var pkg = require('../package.json');

program.version(pkg.version);

program
  .command('start')
  .option('-p, --port <num>', 'Alternate port to which the application should listen')
  .action((options) => {
    var capri = require('../lib/capri');
    capri.run(options);
  });
