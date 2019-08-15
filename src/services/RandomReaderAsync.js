module.exports = function(randomReader) {
  const randomReaderAsync = {};
  for (var key in randomReader) {
    var value = randomReader[key];
    if (typeof value === "function") {
      const build = (key, value) => {
        randomReaderAsync[key] = function() {
          const result = value.apply(randomReader, arguments);
          return new Promise(function(resolve) {
            resolve(result);
          });
        };
      };
      build(key, value);
    }
  }
  return randomReaderAsync;
};
