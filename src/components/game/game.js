var gameInitializer = require("../../services/gameInitializer");
var commandCenter = require("../../services/commandCenter");
var logger = require("../../alias/Logger").getLogger("game");

/** @ngInject */
function game($route) {
    'use strict';

    return {
        restrict: 'E',
        templateUrl: "components/game/game.html",
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
              logger.info("ready", game);
              scope.game = game;
              commandCenter.setGame(game);
              commandCenter.linkScope(scope);
              scope.ready = true;
              scope.$apply();
            }).catch(function(err) {
              logger.info("error when initializing the game");
              console.error(err);
            });
        }
    };
}

angular.module("adriatik").directive("game", game);
