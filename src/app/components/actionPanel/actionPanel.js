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
        link: function (scope) {
            scope.CommandType = CommandType;
            scope.iconSize = 20;
            scope.god = function () {
                return scope.game.currentPlayer.god;
            }
            scope.selectMode = function (mode) {
                var selected = mode !== $rootScope.mode;
                console.log("mode", mode, selected);
                $rootScope.mode = selected ? mode : null;
                scope.mode = $rootScope.mode;
            }
            scope.endTurn = function () {
                scope.game.endPlayerTurn();
            }
            scope.Phases = Phases;
        }
    };
}

angular.module("adriatik").directive("actionPanel", actionPanel);
