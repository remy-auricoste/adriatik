var gameFinder = require("../../services/gameFinder");

/** @ngInject */
function room() {
    'use strict';
    return {
        restrict: 'E',
        templateUrl: "components/room/room.html",
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
