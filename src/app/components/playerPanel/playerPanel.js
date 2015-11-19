/** @ngInject */
function playerPanel(gravatarService) {
    'use strict';

    return {
        restrict: 'E',
        templateUrl: "app/components/playerPanel/playerPanel.html",
        replace: true,
        scope: {
            game: "="
        },
        link: function (scope) {
            scope.gravatarService = gravatarService;
        }
    };
}

angular.module("adriatik").directive("playerPanel", playerPanel);
