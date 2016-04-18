var TimedArray = require("../../model/tools/TimedArray");
var cron = require("../../services/cron");
var exceptionHandler = require("../../services/exceptionHandler");

/** @ngInject */
function errorPanel() {
    'use strict';

    return {
        restrict: 'E',
        templateUrl: "components/errorPanel/errorPanel.html",
        replace: true,
        scope: {
        },
        link: function (scope) {
          scope.errors = new TimedArray({ttl: 10000});
          scope.showError = false;
          exceptionHandler.$onError(function(exception) {
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
