var gameFinder = require("../../services/gameFinder");
var logger = require("../../alias/Logger").getLogger("room");

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
                logger.info("search", scope.playerSize);
                gameFinder.find(parseInt(scope.playerSize));
            }
        }
    };
}

angular.module("adriatik").directive("room", room);
