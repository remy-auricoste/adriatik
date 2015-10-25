/** @ngInject */
function room(gameFinder, gameSocket) {
    'use strict';
    return {
        restrict: 'E',
        templateUrl: "app/components/room/room.html",
        replace: true,
        scope: {
        },
        link: function (scope, elements, attr) {
            scope.search = function () {
                console.log("search", scope.playerSize);
                gameFinder.find(parseInt(scope.playerSize));
            }
        }
    };
}

angular.module("adriatik").directive("room", room);
