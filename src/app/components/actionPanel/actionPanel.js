/** @ngInject */
function actionPanel($http) {
    'use strict';

        return {
            restrict: 'E',
            templateUrl: "app/components/actionPanel/actionPanel.html",
            replace: true,
            scope: {
              game: "="
            },
            link: function(scope) {
              scope.iconSize = 20;
              scope.god = function() {
                return scope.game.currentPlayer.god;
              }

            }
        };
}

angular.module("adriatik").directive("actionPanel", actionPanel);
