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
              scope.game = game;
              game.startTurn().then(function() {
                scope.ready = true;
              });
            }
        };
}

angular.module("adriatik").directive("game", game);
