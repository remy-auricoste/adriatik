var Command = require("../../model/data/Command");
var CommandType = require("../../model/data/CommandType");

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
          var emitResolveBattle = function(options) {
            $rootScope.$emit("command", new Command({
              type: CommandType.ResolveBattle,
              player: scope.game.currentPlayer,
              args: [scope.game.currentBattle, options]
            }));
          }


          scope.selectedUnit = null;
          scope.selectUnit = function(unit) {
            if (!scope.isSelectable(unit)) {
              return;
            }
            scope.selectedUnit = unit;
            emitResolveBattle({unit: unit});
          }
          scope.isSelectable = function(unit) {
            return scope.game.currentBattle.getLoss(unit.owner);
          }

          scope.stayButton = function() {
            emitResolveBattle({});
          }
          scope.retreatButton = function() {
              scope.isChoosingRetreat = true;
              $rootScope.mode = {select: "Territory"};
          }
          $rootScope.$on("select", function(event, selection) {
            if (!scope.game.currentBattle) {
              return;
            }
            console.log("battlePanel selection", selection);
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
