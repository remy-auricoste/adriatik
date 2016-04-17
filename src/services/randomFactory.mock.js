console.log("loading randomFactory mock");

var hashService = require("./hashService");
var qPlus = require("./qPlus");

var randomFactory = require("./randomFactoryBuilder")(qPlus, null, hashService);
randomFactory.generate = function(number, networkSize, id) {
  return qPlus.value(Array.seq(1, number).map(function() {
    return 0;
  }));
}

module.exports = randomFactory;
