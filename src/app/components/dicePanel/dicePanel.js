/** @ngInject */
function dicePanel() {
    'use strict';
    return {
        restrict: 'E',
        templateUrl: "app/components/dicePanel/dicePanel.html",
        replace: true,
        scope: {
        },
        link: function (scope, elements, attr) {
            scope.random = "show-front";
            scope.throwDice = function() {
                var index = Math.round(Math.random() * 5) + 1;
                var dice = ["front", "back", "top", "bottom", "right", "left"];
                scope.random = "show-" + (dice[index]);
            }
        }
    };
}

angular.module("adriatik").directive("dicePanel", dicePanel);
