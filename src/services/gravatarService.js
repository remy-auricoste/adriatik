var Request = require("rauricoste-request");
const Logger = require("rauricoste-logger");
var logger = require("../alias/Logger")(Logger).getLogger("gravatarService");
var md5 = require("MD5");

var gravatarService = {
  cache: {},
  getJson: function(email) {
    if (this.cache[email]) {
      return this.cache[email];
    }
    var hash = md5.createHash(email);
    return new Request()
      .get("https://www.gravatar.com/" + hash)
      .then(function(res) {
        logger.info(res.headers);
        var locationHeader = res.headers.Location;
        if (locationHeader) {
          return new Request().get(locationHeader);
        } else {
          return res;
        }
      })
      .then(function(res) {
        logger.info(res.body);
        return JSON.parse(res.body);
      });
  },
  getUsername: function(email) {
    return this.getJson(email).then(function(gravatar) {
      logger.info(gravatar);
    });
  },
  getPictureUrl: function(email) {
    if (!email) {
      return null;
    }
    return "https://www.gravatar.com/avatar/" + md5.createHash(email) + "?s=50";
  }
};

module.exports = gravatarService;
