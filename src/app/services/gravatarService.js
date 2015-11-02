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
      $http.get("http://www.gravatar.com/"+hash).then(function(res) {
        console.log(res.headers);
        var locationHeader = res.headers.Location;
        if (locationHeader) {
          return $http.get(locationHeader);
        } else {
          return res;
        }
      }).then(function(res) {
        console.log(res.body);
        return JSON.parse(res.body);
      });
    },
    getUsername: function(email) {
      return this.getJson(email).then(function(gravatar) {
        console.log(gravatar);
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


