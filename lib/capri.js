var path = require('path');
var chalk = require('chalk');
var execSync = require('child_process').execSync;
var opn = require('opn');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config.js');
var log = require('./log');
var detect = require('detect-port');
var rl = require('readline');

exports.run = (options) => {
  exports.detect(options, (err) => {
    if (err) {
      process.exit();
    } else {
      var compiler = exports.setupCompiler(options);
      exports.startServer(options, compiler);
    }
  });
};

exports.detect = (options, done) => {
  detect(options.port).then(port => {
    if (port === options.port) {
      done();
    } else {
      exports.getNewPort(options, done);
    }
  });
};

exports.getNewPort = (options, done) => {
  exports.clearConsole();
  var question = chalk.yellow(`Something is already running at port ${options.port}.`) +
    '\n\nWould you like to run the app at another port instead? [Y/n]';

  var prompt = rl.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  prompt.question(question, (answer) => {
    answer = !answer || /^(yes|y)$/i.test(answer) ? true : false;
    if (answer) {
      prompt.question('Enter port number: ', (port) => {
        port = Number(port);
        if (port === port) {
          options.port = port;
          done();
        } else {
          done(true);
        }
        prompt.close();
      });
    } else {
      prompt.close();
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
    hot: true, // Note: only CSS is currently hot reloaded
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
    exports.openBrowser(options);
  });
};

exports.clearConsole = () => {
  process.stdout.write('\x1bc');
};

exports.openBrowser = (options) => {
  if (process.platform === 'darwin') {
    try {
      // Try our best to reuse existing tab
      // on OS X Google Chrome with AppleScript
      var applescript = path.resolve(__dirname, './utils/chrome.applescript');
      execSync('ps cax | grep "Google Chrome"');
      execSync(`osascript ${applescript} http://localhost:${options.port}/`);
      return;
    } catch (err) {
      // Ignore errors.
    }
  }
  // Fallback to opn
  // (It will always open new tab)
  opn('http://localhost:' + options.port + '/');
};
