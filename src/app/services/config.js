/** @ngInject */
function config($location) {
  'use strict';
  return {
    isDev: function() {
      var path = $location.path();
      return path.startsWith("/dev/");
    }
  }
}

angular.module("adriatik").service("config", config);


