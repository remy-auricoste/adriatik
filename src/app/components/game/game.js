/** @ngInject */
function game(gameInitializer, $route, randomFactory, qPlus, gameStorage, $rootScope, commandSocket, config) {
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

            var executeCommand = function(command) {
                var id = Math.random() + "";
                command.id = id;
                randomFactory.setGlobalId(command.id);
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
            }

            commandSocket.addListener(function(messageObj) {
              var source = messageObj.source;
              if (source === commandSocket.getId()) {
                // ignore my commands
                return;
              }
              var command = Command.fromObject(messageObj.message);
              console.log("commandSocket received", command, "source", source);
              var playerSocketId = command.player.account.id;
              if (!config.isDev() && playerSocketId !== source) {
                throw new Error("received a command not from the actual player. source="+source+". player id="+playerSocketId);
              }
              executeCommand(command);
              scope.$apply();
            });

            $rootScope.$on("command", function(event, command) {
              if (!config.isDev() && commandSocket.getId() !== command.player.account.id) {
                throw new Error("Ce n'est pas à votre tour de jouer");
              }
              executeCommand(command);
              console.log("sending command", command);
              commandSocket.send(JSON.parse(JSON.stringify(command)));
            });
        }
    };
}

angular.module("adriatik").directive("game", game);
