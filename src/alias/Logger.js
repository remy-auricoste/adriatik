var Request = require("rauricoste-request");
var config = require("../services/config");

var rootLogger = require("rauricoste-logger");
rootLogger.setLevel("info");
// TODO fix this
//if (!config.isLocal()) {
//  rootLogger.addAppender(function(logger, methodName, callArgs) {
//    if (methodName === rootLogger.levels.error.name) {
//      new Request().post("http://log-collector.herokuapp.com", [logger.name, methodName].concat(callArgs).join("  "));
//    }
//  });
//}

module.exports = rootLogger;
