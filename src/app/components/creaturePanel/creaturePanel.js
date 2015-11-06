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
        }
    };
}

angular.module("adriatik").directive("creaturePanel", creaturePanel);
