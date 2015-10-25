/** @ngInject */
function config() {
    'use strict';

    return {
        restrict: 'E',
        templateUrl: "app/components/config/config.html",
        replace: true,
        scope: {
        },
        link: function (scope) {
          scope.open = function() {
            window.open("/config", '_blank');
          }
        }
    };
}

angular.module("adriatik").directive("config", config);
