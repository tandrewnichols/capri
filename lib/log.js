// Prevents tests from writing output to the terminal
module.exports = function() {
  console.log.apply(console, arguments);
};
