/** @ngInject */
function gameFinder($window, socket) {
  'use strict';

  var addWindowCloseListener = function(fonction) {
    window.onbeforeunload = fonction;
  }

  return {
    find: function(playerSize) {
      var roomName = "adriatik-search-game-"+playerSize+"-players";
      socket.openRoom(roomName);

      addWindowCloseListener(function() {
        socket.leaveRoom(roomName);
      });
    }
  }
}
angular.module("adriatik").service("gameFinder", gameFinder);


