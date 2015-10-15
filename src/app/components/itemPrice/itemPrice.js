/** @ngInject */
function itemPrice($http) {
    'use strict';

        return {
            restrict: 'E',
            templateUrl: "app/components/itemPrice/itemPrice.html",
            replace: true,
            scope: {
              iconSize: "@",
              price: "@"
            },
            link: function(scope) {
            }
        };
}

angular.module("adriatik").directive("itemPrice", itemPrice);
