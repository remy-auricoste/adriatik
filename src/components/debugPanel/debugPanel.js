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
              scope.game.getCurrentPlayer().gold++;
            }
            scope.saveSlot = function() {
              gameStorage.save(scope.game, "slot");
            }
            scope.loadSlot = function() {
              gameStorage.copy("slot", gameStorage.defaultName);
              window.location.reload(true);
            }
        }
    };
}

angular.module("adriatik").directive("debugPanel", debugPanel);
