var accountService = require("../../services/accountService");

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
          scope.account = accountService.getData();
          scope.save = function() {
            accountService.save(scope.account);
          }
        }
    };
}

angular.module("adriatik").directive("accountPage", accountPage);
