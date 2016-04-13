var cron = require("../../services/cron");

/** @ngInject */
function errorPanel($exceptionHandler) {
    'use strict';

    return {
        restrict: 'E',
        templateUrl: "app/components/errorPanel/errorPanel.html",
        replace: true,
        scope: {
        },
        link: function (scope) {
          scope.errors = new TimedArray({ttl: 10000});
          scope.showError = false;
          $exceptionHandler.$onError(function(exception) {
            scope.errors.push(exception.message);
          })
          scope.close = function(message) {
            scope.errors.remove(message);
              scope.showError = false;
          }
          cron(function() {
            scope.$apply();
          }, 1000);
        }
    };
}

angular.module("adriatik").directive("errorPanel", errorPanel);
