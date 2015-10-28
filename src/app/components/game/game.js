/** @ngInject */
function game(gameInitializer, $route) {
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
            gameInitializer.init(playerSize).then(function(game) {
              console.log("ready", game);
              scope.game = game;
              scope.ready = true;
            }).catch(function(err) {
              console.error(err);
            });
        }
    };
}

angular.module("adriatik").directive("game", game);
