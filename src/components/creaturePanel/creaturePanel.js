/** @ngInject */
function creaturePanel($rootScope) {
    'use strict';
    return {
        restrict: 'E',
        templateUrl: "app/components/creaturePanel/creaturePanel.html",
        replace: true,
        scope: {
          game: "="
        },
        link: function (scope, elements, attr) {
          scope.targets = [];
          scope.useCreature = function(creature) {
            console.log("use creature", creature);
            var creatureArgs = scope.targets;
            var command = new Command({
              type: CommandType.BuyCreature,
              player: scope.game.currentPlayer,
              args: [creature, creatureArgs]
            });
            $rootScope.$emit("command", command);
          }
          scope.selectCreature = function(creature) {
            if (!creature) {
              return;
            }
            if (!creature.targetTypes.length) {
              scope.useCreature(creature);
            } else {
              if (scope.selectedCreature !== creature) {
                scope.selectedCreature = creature;
                scope.targets = [];
                var type = creature.targetTypes[0];
                $rootScope.mode = {select: type};
              } else {
                scope.selectedCreature = null;
                $rootScope.mode = null;
              }
            }
          }
          scope.validateSelection = function() {

          }

          $rootScope.$on("select", function(event, selection) {
            console.log("selected", selection);
            if (!scope.selectedCreature || !selection) {
              return;
            }
            var expectedTargetType = scope.selectedCreature.targetTypes[scope.targets.length];
            try { scope.selectedCreature.checkType(expectedTargetType, selection); } catch(err) { return; }
            console.log("add target", selection);
            scope.targets.push(selection);
            if (scope.targets.length === scope.selectedCreature.targetTypes.length) {
              scope.useCreature(scope.selectedCreature);
            }
            var nextType = scope.selectedCreature.targetTypes[scope.targets.length];
            $rootScope.mode = nextType ? {select: nextType} : null;
          })
        }
    };
}

angular.module("adriatik").directive("creaturePanel", creaturePanel);
