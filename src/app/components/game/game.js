/** @ngInject */
function game(gameInitializer, $route, randomFactory, qPlus) {
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
            try {
              playerSize = parseInt(playerSize);
              if (isNaN(playerSize)) {
                throw new Error("playerSize=NaN");
              }
              gameInitializer.init(playerSize).then(function(game) {
                console.log("ready", game);
                scope.game = game;
                scope.ready = true;
              }).catch(function(err) {
                console.error(err);
              });
            } catch(err) {
              var playerFactory = function(account) {
                return angular.extend(Player.new(account.name), new GraphicPlayer({account: account}));
              }
              var game = new Game({
                  players: [
                      playerFactory({name: "Alain", email:"adoanhuu@gmail.com"}),
                      playerFactory({name: "Alan", email:"alan.leruyet@free.fr"}),
                      playerFactory({name: "Charles", email:"chales.lescot@gmail.com"}),
                      playerFactory({name: "Rémy", email:"remy.auricoste@gmail.com"})
                  ],
                  gods: God.all,
                  randomFactory: randomFactory,
                  q: qPlus
              });
              game.startTurn().then(function() {
                scope.game = game;
              });
            }
        }
    };
}

angular.module("adriatik").directive("game", game);
