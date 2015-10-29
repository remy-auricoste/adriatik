/** @ngInject */
function gameStorage() {
    'use strict';
    var key = window.location.path;

    return {
        save: function(object) {
          console.log("saved", object);
          var saved = JSON.stringify(object);
          console.log("saved", saved);
          localStorage[key] = saved;
        },
        load: function() {
          var value = localStorage[key];
          return value ? JSON.parse(value) : value;
        }
    }
}

angular.module("adriatik").service("gameStorage", gameStorage);
