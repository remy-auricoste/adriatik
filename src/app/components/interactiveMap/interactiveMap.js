angular.module("adriatik").directive("interactiveMap", [function() {

    'use strict';

        return {
            restrict: 'E',
            templateUrl: "app/components/interactiveMap/interactiveMap.html",
            replace: true,
            scope: {
              title: "@"
            },
            link: function(scope) {

              console.log(scope.title);
            }
        };
}]);
