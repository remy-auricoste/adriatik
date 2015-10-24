/** @ngInject */
function itemPrice() {
    'use strict';

    return {
        restrict: 'E',
        templateUrl: "app/components/itemPrice/itemPrice.html",
        replace: true,
        scope: {
            iconSize: "@",
            iconName: "@",
            price: "@"
        },
        link: function (scope) {
        }
    };
}

angular.module("adriatik").directive("itemPrice", itemPrice);
