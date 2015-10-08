angular.module("adriatik").directive("game", ["$log", function($log) {

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
