/** @ngInject */
function icon() {
    'use strict';

    return {
        restrict: 'E',
        templateUrl: "components/icon/icon.html",
        replace: true,
        scope: {
            size: "@",
            fileName: "@"
        },
        link: function (scope) {
        }
    };
}

angular.module("adriatik").directive("icon", icon);