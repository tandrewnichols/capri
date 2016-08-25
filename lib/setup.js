var spawn = require('cross-spawn');
var chalk = require('chalk');
var findup = require('find-up');
var fs = require('fs');
var async = require('async');
var log = require('./log');
var opted = require('opted');
var path = require('path');

exports.start = (options) => {
  async.seq(
    exports.install,
    exports.getBase,
    exports.writeJsonHook
  )(options, (err) => {
    if (err && typeof err === 'number') {
      log(chalk.red('An error occurred installing capri in your application'));
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

exports.getBase = (options, done) => {
  if (options.base) {
    done(null, options);
  } else {
    findup('package.json').then((filepath) => {
      options.base = filepath;
      done(null, options);
    });
  }
};

exports.writeJsonHook = (options, done) => {
  var pkgPath = options.base.indexOf('.json') > -1 ? options.base : path.join(options.base, 'package.json');
  var pkg = require(pkgPath);
  if (!pkg.scripts) {
    pkg.scripts = {};
  }

  var opts = exports.getOpts(options);
  pkg.scripts.capri = 'capri' + (opts ? ' ' + opts : '') + ' start';

  log();
  log(chalk.cyan('Writing npm script to start the capri server'));
  fs.writeFile(pkgPath, JSON.stringify(pkg, null, 2), done);
};

exports.getOpts = (options) => {
  var opts = {};
  for (var opt of ['port', 'routes', 'middleware']) {
    if (options[opt]) {
      opts[opt] = options[opt];
    }
  }
  return opted(opts).join(' ');
};
