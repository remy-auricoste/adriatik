/** @ngInject */
function notificationBox($timeout) {
    'use strict';

    return {
        restrict: 'E',
        templateUrl: "app/components/notificationBox/notificationBox.html",
        replace: true,
        scope: {
            game: "="
        },
        link: function (scope, element, attrs) {
            scope.showNotificationBox = false;
            scope.message = "";

            scope.displayNotification = function (message) {
                scope.showNotificationBox = true;
                scope.message = message;

                $timeout(hideNotification(), 500);
            }

            scope.hideNotification = function () {
                scope.showNotificationBox = false;
                scope.message = "";

                element.remove();
            }
        }
    };
}

angular.module("adriatik").directive("notificationBox", notificationBox);
