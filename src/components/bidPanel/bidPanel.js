var gameStorage = require("../../services/gameStorage");
var Phases = require("../../model/data/Phases");
var God = require("../../model/data/God");
var Command = require("../../model/data/Command");
var CommandType = require("../../model/data/CommandType");

/** @ngInject */
function bidPanel($rootScope, $timeout) {
    'use strict';

    return {
        restrict: 'E',
        templateUrl: "components/bidPanel/bidPanel.html",
        replace: true,
        scope: {
            game: "="
        },
        link: function (scope, elements, attr) {
            scope.gameStorage = gameStorage;
            scope.visibleCoins = function(god) {
              var godBid = (god && god.bid && god.bid.gold) ? god.bid.gold : 0;
              var coinsNb = Math.max(scope.game.currentPlayer.gold, godBid);
              console.log(god.name, coinsNb);
              return Array.seq(1, coinsNb);
            }

            scope.placeBid = function (god, value) {
                var command = new Command({type: CommandType.Bid, player: scope.game.currentPlayer, args: [god, value]})
                $rootScope.$emit("command",  command);
            }
            scope.Phases = Phases;
            scope.God = God;
            scope.rootScope = $rootScope;
        }
    };
}

angular.module("adriatik").directive("bidPanel", bidPanel);
