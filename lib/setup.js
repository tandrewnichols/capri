var spawn = require('cross-spawn');
var chalk = require('chalk');
var findup = require('find-up');
var fs = require('fs');
var async = require('async');
var log = require('./log');

exports.start = (options) => {
  async.seq(
    exports.install,
    exports.getRoot,
    exports.writeJsonHook
  )(options, (err) => {
    if (err && typeof err === 'number') {
      log(chalk.red('An error occurred install capri in your application'));
    } else if (err) {
      log(chalk.red('An error occurred adding the npm script to start capri'));
      log(err);
    }
  });
};

exports.install = (options, done) => {
  log();
  log(chalk.cyan('Installing local copy of capri'));

  var args = ['install'];
  if (options.save) {
    args.push('--save-dev');
  }
  args.push('capri');

  var install = spawn('npm', args, { stdio: 'inherit' });
  install.on('close', (code) => {
    done(code, options);
  });
};

exports.getRoot = (options, done) => {
  if (options.root) {
    done(null, options);
  } else {
    findup('package.json').then((filepath) => {
      options.root = filepath;
      done(null, options);
    });
  }
};

exports.writeJsonHook = (options, done) => {
  var pkg = require(options.root);
  if (!pkg.scripts) {
    pkg.scripts = {};
  }

  var script = (options.port ? 'capri -p ' + options.port : 'capri') + ' start';
  pkg.scripts.capri = script;

  log();
  log(chalk.cyan('Writing npm script to start the capri server'));
  fs.writeFile(options.root, JSON.stringify(pkg, null, 2), done);
};
