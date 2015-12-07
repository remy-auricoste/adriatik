/** @ngInject */
function game(gameInitializer, $route, randomFactory, qPlus, gameStorage, $rootScope, commandSocket) {
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

            commandSocket.addListener(function(messageObj) {
              var command = Command.fromObject(messageObj.message);
              console.log("commandSocket received", command);
              var result = scope.game.receiveCommand(command);
              var thenFct = function(result) {
                gameStorage.save(scope.game);
              }
              if (result && typeof result.then === "function") {
                result.then(thenFct).catch(function(err) {
                  console.error("error");
                  console.error(err);
                });
              } else {
                thenFct(result);
              }
              scope.$apply();
            });

            $rootScope.$on("command", function(event, command) {
              var id = Math.random() + "";
              command.id = id;
              randomFactory.setGlobalId(id);
              console.log("sending command", command);
              commandSocket.send(JSON.parse(JSON.stringify(command)));
            });
        }
    };
}

angular.module("adriatik").directive("game", game);
