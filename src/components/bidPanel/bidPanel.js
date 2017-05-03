var Arrays = require("rauricoste-arrays");

var commandCenter = require("../../services/commandCenter");
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
            scope.visibleCoins = function(god) {
              var godBid = (god && god.bid && god.bid.gold) ? god.bid.gold : 0;
              var coinsNb = Math.max(scope.game.getCurrentPlayer().gold, godBid);
              return Arrays.seq(1, coinsNb);
            }

            scope.placeBid = function (god, value) {
                var command = new Command({type: CommandType.Bid, args: [god, value]})
                commandCenter.send(command);
            }
            scope.Phases = Phases;
            scope.God = God;
        }
    };
}

angular.module("adriatik").directive("bidPanel", bidPanel);
