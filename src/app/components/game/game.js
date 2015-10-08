/** @ngInject */
function game() {
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
}

angular.module("adriatik").directive("game", game);
