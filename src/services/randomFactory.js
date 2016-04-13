var randomSocket = require("./randomSocket");
var hashService = require("./hashService");
var qPlus = require("./qPlus");

module.exports = require("./randomFactoryBuilder")(qPlus, randomSocket, hashService);
