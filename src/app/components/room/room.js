/** @ngInject */
function room(gameFinder, socket) {
    'use strict';

    var KEY_ENTER = 13;

    return {
        restrict: 'E',
        templateUrl: "app/components/room/room.html",
        replace: true,
        scope: {
        },
        link: function(scope, elements, attr) {
          var roomSocket = socket;
          scope.users = roomSocket.getRoomUsers();
          scope.user = "unknown";
          scope.search = function() {
            console.log("search", scope.playerSize);
            gameFinder.find(parseInt(scope.playerSize));
          }
          scope.messages = [
            {user: "remy", text: "test"},
            {user: "remy", text: "test2"}
          ];
          scope.send = function() {
            var message = {user: scope.user, text: scope.text};
            roomSocket.sendNickName(scope.user);
            roomSocket.send(message);
            scope.text = "";
          }
          roomSocket.addListener(function(messageObj) {
            if (typeof messageObj.message.text === "string") {
              scope.messages.push(messageObj.message);
              scope.users = roomSocket.getRoomUsers();
              scope.$apply();
            }
          });
          roomSocket.addRoomListener(function() {
            scope.users = roomSocket.getRoomUsers();
          });
          scope.onKeyDown = function(event) {
            if (event.keyCode === KEY_ENTER) {
              scope.send();
            }
          }
        }
    };
}

angular.module("adriatik").directive("room", room);
