/** @ngInject */
function gameFinder($window, socket, $location) {
    'use strict';

    return {
        search: {},
        find: function (playerSize) {
            var getId = socket.getId;

            var self = this;
            var listener = socket.addListener(function (messageObj) {
                var command = messageObj.message.command;
                if (command === "SEARCH" && messageObj.message.size === playerSize) {
                    var ids = self.search[playerSize];
                    if (!ids) {
                        ids = {};
                        self.search[playerSize] = ids;
                    }
                    ids[messageObj.source] = 1;
                    if (Object.keys(ids).length === playerSize) {
                        self.ready = 0;
                        socket.send({command: "READY?", ids: Object.keys(ids)});
                    }
                } else if (command === "READY?" && messageObj.message.ids.indexOf(getId()) >= 0) {
                    socket.send({command: "READY", ids: messageObj.message.ids});
                } else if (command === "READY" && messageObj.message.ids.indexOf(getId()) >= 0) {
                    self.ready++;
                    if (self.ready === playerSize) {
                        socket.send({command: "GO", ids: messageObj.message.ids});
                    }
                } else if (command === "GO" && messageObj.message.ids.indexOf(getId()) >= 0) {
                    window.location.href = "/game/" + messageObj.message.ids.join('-');
                }
            });
            socket.send({command: "SEARCH", size: playerSize});
        },
        findFast: function () {
            return this.find(4);
        }
    }
}
angular.module("adriatik").service("gameFinder", gameFinder);


