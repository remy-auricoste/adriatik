/** @ngInject */
function bidPanel() {
    'use strict';

        return {
            restrict: 'E',
            templateUrl: "app/components/bidPanel/bidPanel.html",
            replace: true,
            scope: {
            },
            link: function(scope, elements, attr) {
              // TODO pass model
              scope.gods = [
                God.Jupiter,
                God.Minerve,
                God.Mars,
                God.Neptune,
                God.Pluton
              ];
            }
        };
}

angular.module("adriatik").directive("bidPanel", bidPanel);
