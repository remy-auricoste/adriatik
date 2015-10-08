angular.module("adriatik").directive("game", [function() {

    'use strict';

        return {
            restrict: 'E',
            templateUrl: "app/components/game/game.html",
            replace: true,
            scope: {
            },
            link: function() {
            }
        };
}]);
