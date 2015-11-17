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
          scope.onClick = function(creature) {
            var creatureArgs = []; // TODO get the creature card targets
            var command = new Command({
              type: CommandType.BuyCreature,
              player: scope.game.currentPlayer,
              args: [creature, creatureArgs]
            });
            $rootScope.$emit("command", command);
          }
        }
    };
}

angular.module("adriatik").directive("creaturePanel", creaturePanel);
