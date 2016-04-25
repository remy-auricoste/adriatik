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

          scope.selectUnit = function(unit) {
            if (!scope.isSelectable(unit)) {
              return;
            }
            var index = scope.selectedUnits.indexOf(unit);
            if (index >= 0) {
              scope.selectedUnits.splice(index, 1);
            } else {
              scope.selectedUnits.push(unit);
            }
          }
          scope.isSelectable = function(unit) {
            return scope.game.currentBattle.getLoss(unit.owner);
          }

          scope.ok = function() {
            if (!scope.selectedUnits.length) {
              throw new Error("vous n'avez sélectionné aucune unité");
            }
            // TODO remove units via command
          }
        }
    };
}

angular.module("adriatik").directive("battlePanel", battlePanel);
