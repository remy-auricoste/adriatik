/** @ngInject */
function introPanel($rootScope) {
    'use strict';

    return {
        restrict: 'E',
        templateUrl: "app/components/introPanel/introPanel.html",
        replace: true,
        scope: {
        },
        link: function (scope) {
            scope.showIntroBox = true;

            scope.submitConnexion = function () {
                scope.showIntroBox = false;
            }
        }
    };
}

angular.module("adriatik").directive("introPanel", introPanel);
