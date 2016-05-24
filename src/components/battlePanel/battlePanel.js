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
          var init = function() {
            scope.selectedUnits = [];
          }
          init();

          var emitResolveBattle = function(options, player) {
            player = player ? player : scope.game.currentPlayer;
            commandCenter.send(new Command({
              type: CommandType.ResolveBattle,
              player: player,
              args: [scope.game.currentBattle, options]
            }));
          }

          scope.selectUnit = function(unit) {
            if (!scope.isSelectable(unit)) {
              return;
            }
            scope.selectedUnits.push(unit);
            emitResolveBattle({unit: unit}, unit.owner);
          }
          scope.isSelectable = function(unit) {
            return scope.game.currentBattle.getState(unit.owner).loss;
          }
          scope.isSelected = function(unit) {
            return scope.selectedUnits.indexOf(unit) >= 0;
          }

          scope.stayButton = function(player) {
            emitResolveBattle({stay: true}, player);
          }
          scope.retreatButton = function(player) {
              scope.isChoosingRetreat = true;
              scope.retreatingPlayer = player;
              $rootScope.$emit("select.mode", {select: "Territory"});
          }
          $rootScope.$on("select", function(event, selection) {
            if (!scope.game.currentBattle) {
              return;
            }
            logger.info("battlePanel selection", selection, "retreating player", scope.retreatingPlayer.name);
            emitResolveBattle({retreatTerritory: selection}, scope.retreatingPlayer);
            scope.isChoosingRetreat = false;
            scope.retreatingPlayer = null;
            $rootScope.$emit("select.mode", null);
          })

          scope.toggleShow = function() {
            scope.hidden = !scope.hidden;
          }
        }
    };
}

angular.module("adriatik").directive("battlePanel", battlePanel);
