var env = require("../test/env");

var config = {
  isDev: function() {
    if (env.isTest()) {
      return true;
    }
    var path = window.location.hash.substring(1);
    return path.startsWith("/dev/");
  },
  isLocal: function() {
    return window.location.hostname === "localhost";
  }
}

module.exports = config;
