/** @ngInject */
function sesterces() {
    'use strict';

    return {
        restrict: 'E',
        templateUrl: "app/components/sesterces/sesterces.html",
        replace: true,
        scope: {
            number: "@",
            size: "@"
        },
        link: function (scope) {

        }
    };
}

angular.module("adriatik").directive("sesterces", sesterces);
