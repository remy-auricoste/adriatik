/** @ngInject */
function playerPanel(gravatarService, $rootScope) {
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
            scope.selectPlayer = function(player) {
              $rootScope.$emit("select", player);
            }
        }
    };
}

angular.module("adriatik").directive("playerPanel", playerPanel);
