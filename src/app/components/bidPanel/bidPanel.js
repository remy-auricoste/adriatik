/** @ngInject */
function bidPanel() {
    'use strict';

        return {
            restrict: 'E',
            templateUrl: "app/components/bidPanel/bidPanel.html",
            replace: true,
            scope: {
              game: "="
            },
            link: function(scope, elements, attr) {
              scope.getPlayer = function(god) {
                return scope.game.players.filter(function(player) {
                  return player.bid && player.bid.god === god;
                })[0];
              }
              scope.onGodClick = function(god) {
                // TODO UI to choose gold amount
                scope.game.currentPlayer.placeBid(god, 5);
                console.log("bidding", scope.game.currentPlayer);
                scope.game.endPlayerTurn();
              }
              scope.noBidPlayers = function() {
                return scope.game.players.filter(function(player) {
                  return !player.bid;
                })
              }
            }
        };
}

angular.module("adriatik").directive("bidPanel", bidPanel);
