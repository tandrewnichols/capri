#!/usr/bin/env node

let program = module.exports = require('commander');
let pkg = require('../package.json');
let capri = require('../lib/capri');
let setup = require('../lib/setup');

program.version(pkg.version);

program
  .command('init')
  .option('-S, --no-save', 'Do not save capri in package.json when installing')
  .option('-r, --root <path>', 'Root of the repository in which capri is being initialized')
  .option('-H, --no-hook', 'Do not add an npm script to package.json for running capri locally')
  .option('-p, --port <port>', 'Alternate port to which the application should listen')
  .action((options) => {
    setup.start(options);
  });

program
  .command('start')
  .option('-p, --port <port>', 'Alternate port to which the application should listen')
  .action((options) => {
    capri.run(options);
  });

program.parse(process.argv);
