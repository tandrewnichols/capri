// Prevents tests from writing output to the terminal
exports.log = function() {
  console.log.apply(console, arguments);
};
