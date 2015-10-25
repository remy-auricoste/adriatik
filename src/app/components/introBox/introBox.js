/** @ngInject */
function introBox($rootScope) {
    'use strict';

    return {
        restrict: 'E',
        templateUrl: "app/components/introBox/introBox.html",
        replace: true,
        scope: {
            game: "="
        },
        link: function (scope) {
            scope.showIntroBox = true;

            scope.closeIntroBox = function () {
                scope.showIntroBox = false;
            }
        }
    };
}

angular.module("adriatik").directive("introBox", introBox);
