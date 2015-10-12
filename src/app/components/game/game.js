/** @ngInject */
function game(randomFactory, qPlus) {
    'use strict';

        return {
            restrict: 'E',
            templateUrl: "app/components/game/game.html",
            replace: true,
            scope: {
            },
            link: function(scope, elements, attr) {
              scope.ready = false;
              var game = new Game({
                players: [
                  Player.new("Remy", "red"),
                  Player.new("Alain", "blue"),
                  Player.new("Alan", "green"),
                  Player.new("Charles", "black")
                ],
                gods: God.all,
                randomFactory: randomFactory,
                q: qPlus
              });
              game.startTurn().then(function() {
                scope.ready = true;
                scope.game = game;
              });
            }
        };
}

angular.module("adriatik").directive("game", game);
