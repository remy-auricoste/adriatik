/** @ngInject */
function bidPanel($rootScope, $timeout) {
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
                var command = new Command({type: CommandType.Bid, player: scope.game.currentPlayer, args: [god, value]})
                $rootScope.$emit("command",  command);

                scope.golds = [];
                for (var i = 1; i <= scope.game.currentPlayer.gold; i++) {
                    scope.golds.push(i);
                }

                scope.purse = [];
                for (var i = 1; i <= scope.game.currentPlayer.gold; i++) {
                    scope.purse.push(i);
                }
            }
            scope.Phases = Phases;
            scope.God = God;
        }
    };
}

angular.module("adriatik").directive("bidPanel", bidPanel);
