var Arrays = require("rauricoste-arrays");
var logger = require("../alias/Logger").getLogger("randomFactory.mock");
logger.info("loading randomFactory mock");

var hashService = require("./hashService");

var randomFactory = require("./randomFactoryBuilder")(null, hashService);
randomFactory.generate = function(number, networkSize, id) {
  const numbers = Arrays.seq(0, number).map(function() {
    return 0;
  })
  return new Promise(function(resolve) {
    resolve(numbers)
  })
}

module.exports = randomFactory;
