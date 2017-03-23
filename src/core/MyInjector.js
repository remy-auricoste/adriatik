var Injector = require("./Injector");

var Random = require("rauricoste-random");
var RandomReaderAsync = require("../services/RandomReaderAsync");

var MyInjector = new Injector();
MyInjector.register("randomReader", Random.zero);
MyInjector.register("randomReaderAsync", ["randomReader"], function(randomReader) {
  return RandomReaderAsync(randomReader);
});

module.exports = MyInjector;
