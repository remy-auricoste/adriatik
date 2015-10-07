angular.module("adriatik").directive("interactiveMap", ["$log", function($log) {

    'use strict';

        return {
            restrict: 'E',
            templateUrl: "app/components/map/interactiveMap.html",
            replace: true,
            scope: {
              title: "@"
            },
            link: function(scope) {

              console.log(scope.title);
            }
        };
}]);
