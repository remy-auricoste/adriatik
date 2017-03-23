var Arrays = require("rauricoste-arrays");
var logger = require("../alias/Logger").getLogger("randomFactory.mock");
logger.info("loading randomFactory mock");

var hashService = require("./hashService");
var qPlus = require("./qPlus");

var randomFactory = require("./randomFactoryBuilder")(qPlus, null, hashService);
randomFactory.generate = function(number, networkSize, id) {
  return qPlus.value(Arrays.seq(0, number).map(function() {
    return 0;
  }));
}

module.exports = randomFactory;
