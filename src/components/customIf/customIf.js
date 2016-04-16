/** @ngInject */
function customIf() {
    'use strict';
    return {
        restrict: 'A',
        templateUrl: "components/customIf/customIf.html",
        replace: false,
        transclude: true,
        scope: {
          customIf: "="
        },
        link: function (scope, elements, attr) {
        }
    };
}

angular.module("adriatik").directive("customIf", customIf);
