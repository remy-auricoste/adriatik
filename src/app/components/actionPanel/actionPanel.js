/** @ngInject */
function actionPanel($rootScope) {
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
              scope.selectMode = function(mode) {
                var selected = mode !== scope.mode;
                scope.mode = selected ? mode : null;
                console.log("toggle mode", mode, selected);
                $rootScope.$emit("select.mode", mode, selected);
              }
            }
        };
}

angular.module("adriatik").directive("actionPanel", actionPanel);
