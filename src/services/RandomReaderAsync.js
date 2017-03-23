var Q = require("rauricoste-promise-light");

var RandomReaderAsync = function(randomReader) {
  var randomReaderAsync = {};
  for (var key in randomReader) {
    var value = randomReader[key];
    if (typeof value === "function") {
      var build = function(key, value) {
        randomReaderAsync[key] = function() {
          return Q.value(value.apply(randomReader, arguments));
        }
      }
      build(key, value);
    }
  }
  return randomReaderAsync;
}

module.exports = RandomReaderAsync;


