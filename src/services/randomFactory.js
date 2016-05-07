var logger = require("../alias/Logger").getLogger("randomFactory");

if (env.isTest()) {
  logger.info("env test detected", "using mock");
  module.exports = require("./randomFactory.mock");
} else {
  var randomSocket = require("./randomSocket");
  var hashService = require("./hashService");
  var qPlus = require("./qPlus");

  module.exports = require("./randomFactoryBuilder")(qPlus, randomSocket, hashService);
}
