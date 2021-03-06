var env = require("../test/env");
var logger = require("../alias/Logger").getLogger("randomFactory");

if (env.isTest()) {
  logger.info("env test detected", "using mock");
  module.exports = require("./randomFactory.mock");
} else {
  var randomSocket = require("./randomSocket");
  var hashService = require("./hashService");
  module.exports = require("./randomFactoryBuilder")(randomSocket, hashService);
}
