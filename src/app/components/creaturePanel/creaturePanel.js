/** @ngInject */
function creaturePanel() {
    'use strict';
    return {
        restrict: 'E',
        templateUrl: "app/components/creaturePanel/creaturePanel.html",
        replace: true,
        scope: {
        },
        link: function (scope, elements, attr) {
          //scope.CreatureCard = CreatureCard;
          scope.creatures = Object.keys(CreatureCard._all).slice(0, 3).map(function(key) {
            return CreatureCard._all[key];
          });
        }
    };
}

angular.module("adriatik").directive("creaturePanel", creaturePanel);
