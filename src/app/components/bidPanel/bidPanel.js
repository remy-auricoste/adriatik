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
        link: function (scope, elements, attr) {
            scope.golds = [];
            for (var i = 1; i <= 7; i++) {
                scope.golds.push(i);
            }

            scope.noBidPlayers = function () {
                return scope.game.players.filter(function (player) {
                    return !player.bid;
                })
            }
            scope.placeBid = function (god, value) {
                var removedPlayer = scope.game.placeBid(scope.game.currentPlayer, god, value);

                scope.golds = [];
                for (var i = 1; i <= scope.game.currentPlayer.gold; i++) {
                    scope.golds.push(i);
                }

                scope.purse = [];
                for (var i = 1; i <= scope.game.currentPlayer.gold; i++) {
                    scope.purse.push(i);
                }
                console.log("removed player", removedPlayer);
                console.log("bidding", scope.game.currentPlayer);
            }
            scope.placeCustomBid = function (god) {
                var amount = parseInt(scope.customBidValue);
                scope.placeBid(god, amount);
            }
            scope.Phases = Phases;
            scope.God = God;
        }
    };
}

angular.module("adriatik").directive("bidPanel", bidPanel);
