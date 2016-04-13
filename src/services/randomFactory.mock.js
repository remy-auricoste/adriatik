var hashService = require("./hashService");
var randomFactoryBuilder = require("./randomFactoryBuilder");
var qPlus = require("./qPlus");
var randomSocketMock = require("./randomSocket.mock");

var randomFactoryInstance = randomFactoryBuilder(qPlus, randomSocketMock, hashService);

module.exports = randomFactoryInstance;
