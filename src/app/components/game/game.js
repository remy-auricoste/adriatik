/** @ngInject */
function game() {
    'use strict';

        return {
            restrict: 'E',
            templateUrl: "app/components/game/game.html",
            replace: true,
            scope: {
            },
            link: function(scope, elements, attr) {
              var game = new Game({
                players: [
                  Player.new("Remy", "red"),
                  Player.new("Alain", "blue"),
                  Player.new("Alan", "green"),
                  Player.new("Charles", "black")
                ]
              });
              scope.game = game;
            }
        };
}

angular.module("adriatik").directive("game", game);
