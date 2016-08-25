var path = require('path');
var chalk = require('chalk');
var execSync = require('child_process').execSync;
var opn = require('opn');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('../webpack.config.js');
var log = require('./log');
var detect = require('detect-port');
var inquirer = require('inquirer');
var collector = require('./collector');

exports.run = (options) => {
  exports.detect(options, (err) => {
    if (err) {
      process.exit();
    } else {
      collector.createManifest(options, (err) => {
        var compiler = exports.setupCompiler(options);
        exports.startServer(options, compiler);
      });
    }
  });
};

exports.detect = (options, done) => {
  detect(options.port).then((port) => {
    if (port === options.port) {
      done();
    } else {
      exports.getNewPort(options, done);
    }
  });
};

exports.getNewPort = (options, done) => {
  exports.clearConsole();
  log(chalk.yellow(`Something is already running at port ${options.port}.`));

  inquirer.prompt([{
    type: 'confirm',
    name: 'change',
    message: 'Would you like to run the app at another port instead?',
    'default': true
  }, {
    type: 'input',
    name: 'port',
    message: 'What port?',
    when: answers => answers.change
  }]).then((answers) => {
    if (answers.change) {
      done();
    } else {
      done(true);
    }
  });
};

exports.setupCompiler = (options) => {
  var compiler = webpack(config);

  compiler.plugin('invalid', () => {
    exports.clearConsole();
    log('Compiling...');
  });

  compiler.plugin('done', (stats) => {
    exports.clearConsole();
    var hasErrors = stats.hasErrors();
    var hasWarnings = stats.hasWarnings();
    if (!hasErrors && !hasWarnings) {
      log(chalk.green('Compiled successfully!'));
      log();
      log(`The app is running at http://localhost:${options.port}/`);
      log();
      return;
    }
  });

  return compiler;
};

exports.startServer = (options, compiler) => {
  options.port = options.port || '3131';
  new WebpackDevServer(compiler, {
    historyApiFallback: true,
    hot: true,
    publicPath: config.output.publicPath,
    quiet: true,
    watchOptions: {
      ignored: /node_modules/
    }
  }).listen(options.port, (err, result) => {
    if (err) {
      return log(err);
    }

    exports.clearConsole();
    log(chalk.cyan('Starting the development server...'));
    log();
    opn('http://localhost:' + options.port + '/');
  });
};

exports.clearConsole = () => {
  process.stdout.write('\x1bc');
};
