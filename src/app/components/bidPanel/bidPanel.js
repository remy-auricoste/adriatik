/** @ngInject */
function bidPanel() {
    'use strict';

        return {
            restrict: 'E',
            templateUrl: "app/components/bidPanel/bidPanel.html",
            replace: true,
            scope: {
              game: "="
            },
            link: function(scope, elements, attr) {
            }
        };
}

angular.module("adriatik").directive("bidPanel", bidPanel);
