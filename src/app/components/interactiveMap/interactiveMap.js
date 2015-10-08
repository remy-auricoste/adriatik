/** @ngInject */
function interactiveMap() {
    'use strict';
        return {
            restrict: 'E',
            templateUrl: "app/components/interactiveMap/interactiveMap.html",
            replace: true,
            scope: {
              title: "@"
            },
            link: function() {
            }
        };
}

angular.module("adriatik").directive("interactiveMap", interactiveMap);
