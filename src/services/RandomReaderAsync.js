var RandomReaderAsync = function(randomReader) {
  var randomReaderAsync = {};
  for (var key in randomReader) {
    var value = randomReader[key];
    if (typeof value === "function") {
      var build = function(key, value) {
        randomReaderAsync[key] = function() {
          const result = value.apply(randomReader, arguments)
          return new Promise(function(resolve) {
            resolve(result)
          })
        }
      }
      build(key, value);
    }
  }
  return randomReaderAsync;
}

module.exports = RandomReaderAsync;


