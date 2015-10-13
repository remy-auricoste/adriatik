/** @ngInject */
function playerPanel($window) {
    'use strict';
        return {
            restrict: 'E',
            templateUrl: "app/components/playerPanel/playerPanel.html",
            replace: true,
            scope: {
              game: "="
            },
            link: function(scope) {
              scope.setPlayer = function(player) {
                scope.currentPlayer = player;
              }
            }
        };
}

angular.module("adriatik").directive("playerPanel", playerPanel);
