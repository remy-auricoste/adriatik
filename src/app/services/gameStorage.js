/** @ngInject */
function gameStorage() {
    'use strict';
    var key = window.location.path;

    return {
        save: function(object) {
          console.log("saved", object);
          var saved = JSON.stringify(object);
          localStorage[key] = saved;
        },
        load: function() {
          var value = localStorage[key];
          if (!value) {
            return null;
          }
          value = JSON.parse(value);
          value = Game.fromObject(value);
          return value;
        }
    }
}

angular.module("adriatik").service("gameStorage", gameStorage);
