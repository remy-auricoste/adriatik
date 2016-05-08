var gameStorage = require("../../services/gameStorage");

/** @ngInject */
function debugPanel($rootScope, $timeout) {
    return {
        restrict: 'E',
        templateUrl: "components/debugPanel/debugPanel.html",
        replace: true,
        scope: {
            game: "="
        },
        link: function (scope, elements, attr) {
            scope.gameStorage = gameStorage;
            scope.rootScope = $rootScope;

            scope.goldPlus = function() {
              scope.game.currentPlayer.gold++;
            }
        }
    };
}

angular.module("adriatik").directive("debugPanel", debugPanel);
