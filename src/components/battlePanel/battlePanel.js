var Command = require("../../model/data/Command");
var CommandType = require("../../model/data/CommandType");
var commandCenter = require("../../services/commandCenter");
var logger = require("../../alias/Logger").getLogger("battlePanel");

/** @ngInject */
function battlePanel($rootScope) {
    return {
        restrict: 'E',
        templateUrl: "components/battlePanel/battlePanel.html",
        replace: true,
        scope: {
            game: "="
        },
        link: function (scope, elements, attr) {
          var emitResolveBattle = function(options, player) {
            player = player ? player : scope.game.currentPlayer;
            commandCenter.send(new Command({
              type: CommandType.ResolveBattle,
              player: player,
              args: [scope.game.currentBattle, options]
            }));
          }

          scope.selectedUnit = null;
          scope.selectUnit = function(unit) {
            if (!scope.isSelectable(unit)) {
              return;
            }
            scope.selectedUnit = unit;
            emitResolveBattle({unit: unit}, unit.owner);
          }
          scope.isSelectable = function(unit) {
            return scope.game.currentBattle.getState(unit.owner).loss;
          }

          scope.stayButton = function(player) {
            emitResolveBattle({stay: true}, player);
          }
          scope.retreatButton = function() {
              scope.isChoosingRetreat = true;
              $rootScope.mode = {select: "Territory"};
          }
          $rootScope.$on("select", function(event, selection) {
            if (!scope.game.currentBattle) {
              return;
            }
            logger.info("battlePanel selection", selection);
            emitResolveBattle({retreatTerritory: selection});
            scope.isChoosingRetreat = false;
          })

          scope.toggleShow = function() {
            scope.hidden = !scope.hidden;
          }
        }
    };
}

angular.module("adriatik").directive("battlePanel", battlePanel);
