/** @ngInject */
function game(gameInitializer, $route, randomFactory, qPlus, gameStorage, $rootScope) {
    'use strict';

    return {
        restrict: 'E',
        templateUrl: "app/components/game/game.html",
        replace: true,
        scope: {
        },
        link: function (scope, elements, attr) {
            scope.ready = false;
            var playerSize = $route.current.params.playerSize;
            playerSize = parseInt(playerSize);
            if (isNaN(playerSize)) {
              playerSize = 0;
            }
            gameInitializer.init(playerSize).then(function(game) {
              console.log("ready", game);
              scope.game = game;
              scope.ready = true;
            }).catch(function(err) {
              console.error(err);
            });

            $rootScope.$on("command", function(event, command) {
              scope.game.receiveCommand(command);
              gameStorage.save(scope.game);
            });
        }
    };
}

angular.module("adriatik").directive("game", game);
