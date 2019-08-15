var Request = require("rauricoste-request");
var logger = console;
var md5 = require("MD5");

class GravatarService {
  constructor() {
    this.cache = {};
  }
  getJson(email) {
    if (this.cache[email]) {
      return this.cache[email];
    }
    var hash = md5.createHash(email);
    return new Request()
      .get("https://www.gravatar.com/" + hash)
      .then(res => {
        logger.info(res.headers);
        var locationHeader = res.headers.Location;
        if (locationHeader) {
          return new Request().get(locationHeader);
        } else {
          return res;
        }
      })
      .then(res => {
        logger.info(res.body);
        return JSON.parse(res.body);
      });
  }
  getUsername(email) {
    return this.getJson(email).then(gravatar => {
      logger.info(gravatar);
    });
  }
  getPictureUrl(email) {
    if (!email) {
      return null;
    }
    return "https://www.gravatar.com/avatar/" + md5.createHash(email) + "?s=50";
  }
}

module.exports = new GravatarService();
