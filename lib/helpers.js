var log = require('./log');
var chalk = require('chalk');

function isSyntaxError(message) {
  return message.indexOf('Syntax error:') !== -1;
}

function formatMessage(message) {
  return message
    // Babel syntax error
    .replace('Module build failed: SyntaxError:', 'Syntax error:')
    // Webpack file not found error
    .replace(/Module not found: Error: Cannot resolve 'file' or 'directory'/, 'Module not found:')
    // Internal stacks are generally useless so we strip them
    .replace(/^\s*at\s.*:\d+:\d+[\s\)]*\n/gm, '') // at ... ...:x:y
    // Webpack loader names obscure CSS filenames
    .replace('./~/css-loader!./~/postcss-loader!', '');
}

exports.onInvalid = () => {
  exports.clearConsole();
  log('Compiling...');
};

exports.onDone = (options, stats) => {
  exports.clearConsole();
  var hasErrors = stats.hasErrors();
  var hasWarnings = stats.hasWarnings();
  if (!hasErrors && !hasWarnings) {
    log(chalk.green('Compiled successfully!'));
    log();
    log(`The app is running at http://localhost:${options.port}/`);
    log();
  } else {
    var json = stats.toJson();
    var formattedErrors = json.errors.map((message) => {
      'Error in ' + formatMessage(message)
    });
    var formattedWarnings = json.warnings.map((message) => {
      'Warning in ' + formatMessage(message)
    });

    if (hasErrors) {
      log(chalk.red('Failed to compile.'));
      log();

      if (formattedErrors.some(isSyntaxError)) {
        // If there are any syntax errors, show just them.
        // This prevents a confusing ESLint parsing error
        // preceding a much more useful Babel syntax error.
        formattedErrors = formattedErrors.filter(isSyntaxError);
      }

      formattedErrors.forEach((message) => {
        log(message);
        log();
      });
      // If errors exist, ignore warnings.
    } else if (hasWarnings) {
      log(chalk.yellow('Compiled with warnings.'));
      log();
      formattedWarnings.forEach((message) => {
        log(message);
        log();
      });
    }
  }
};

exports.clearConsole = () => {
  process.stdout.write('\x1bc');
};
