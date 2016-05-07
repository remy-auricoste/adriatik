var Request = require("rauricoste-request");
var logger = require("../alias/Logger").getLogger("gravatarService");

/** @ngInject */
function gravatarService(md5, $http) {
  'use strict';

  return {
    cache: {},
    getJson: function(email) {
      if (this.cache[email]) {
        return this.cache[email];
      }
      var hash = md5.createHash(email);
      return new Request().get("http://www.gravatar.com/"+hash).then(function(res) {
        logger.info(res.headers);
        var locationHeader = res.headers.Location;
        if (locationHeader) {
          return new Request().get(locationHeader);
        } else {
          return res;
        }
      }).then(function(res) {
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
      return "http://www.gravatar.com/avatar/"+md5.createHash(email)+"?s=50";
    }
  }
}
angular.module("adriatik").service("gravatarService", gravatarService);


