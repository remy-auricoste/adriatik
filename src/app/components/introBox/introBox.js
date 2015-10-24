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
            scope.HideIntroBox = false;
            scope.closeIntroBox = function () {
                scope.HideIntroBox = true;
            }
        }
    };
}

angular.module("adriatik").directive("introBox", introBox);
