angular.module("adriatik").directive("playerPanel", ["$log", function($log) {

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
