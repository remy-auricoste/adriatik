angular.module("adriatik").directive("playerPanel", [function() {

    'use strict';

        return {
            restrict: 'E',
            templateUrl: "app/components/playerPanel/playerPanel.html",
            replace: true,
            scope: {
            },
            link: function() {
            }
        };
}]);
