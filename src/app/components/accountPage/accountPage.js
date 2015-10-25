/** @ngInject */
function accountPage() {
    'use strict';

    return {
        restrict: 'E',
        templateUrl: "app/components/accountPage/accountPage.html",
        replace: true,
        scope: {
        },
        link: function (scope) {
          var keys = ["email"];
          keys.map(function(key) {
            var storageValue = window.localStorage[key];
            if (storageValue !== undefined) {
              scope[key] = storageValue;
            }
          });
          scope.save = function() {
            keys.map(function(key) {
              window.localStorage[key] = scope[key];
            });
          }
        }
    };
}

angular.module("adriatik").directive("accountPage", accountPage);
