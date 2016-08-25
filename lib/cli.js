#!/usr/bin/env node

var program = module.exports = require('commander');
var pkg = require('../package.json');
var capri = require('../lib/capri');
var setup = require('../lib/setup');

program.version(pkg.version);

program
  .command('init')
  .option('-S, --no-save', 'Do not save capri in package.json when installing')
  .option('-b, --base <path>', 'Root of the repository in which capri is being initialized')
  .option('-H, --no-hook', 'Do not add an npm script to package.json for running capri locally')
  .option('-p, --port <port>', 'Alternate port to which the application should listen')
  .option('-r, --routes <path>', 'Location of express routes')
  .option('-m, --middleware <path>', 'Location of express middleware')
  .action((options) => {
    setup.start(options);
  });

program
  .command('start')
  .option('-p, --port <port>', 'Alternate port to which the application should listen')
  .option('-r, --routes <path>', 'Location of express routes')
  .option('-m, --middleware <path>', 'Location of express middleware')
  .action((options) => {
    capri.run(options);
  });

program.parse(process.argv);
