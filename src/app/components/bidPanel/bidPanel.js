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
              scope.onGodClick = function(god) {
                if (god === God.Apollon) {
                  scope.game.placeBid(scope.game.currentPlayer, god, 0);
                  return;
                }
                scope.god = god;
                scope.customBidValue = god.bid ? (god.bid.gold+1) : 1;
              }
              scope.getBidValues = function() {
                if (!scope.god) {
                  return [];
                }
                var startValue = scope.god.bid ? scope.god.bid.gold+1 : 1;
                var result = [];
                for (var i=0;i<5;i++) {
                  result.push(startValue + i);
                }
                return result;
              }
              scope.noBidPlayers = function() {
                return scope.game.players.filter(function(player) {
                  return !player.bid;
                })
              }
              scope.placeBid = function(value) {
                var removedPlayer = scope.game.placeBid(scope.game.currentPlayer, scope.god, value);
                console.log("removed player", removedPlayer);
                console.log("bidding", scope.game.currentPlayer);
                scope.god = null;
              }
              scope.placeCustomBid = function() {
                var amount = parseInt(scope.customBidValue);
                scope.placeBid(amount);
              }
              scope.endTurn = function() {
                scope.game.endPlayerTurn();
              }
              scope.Phases = Phases;
              scope.God = God;
            }
        };
}

angular.module("adriatik").directive("bidPanel", bidPanel);
