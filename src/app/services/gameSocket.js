/** @ngInject */
function gameSocket(socket) {
  'use strict';

  var path = window.location.pathname;
  return socket.openRoom("adriatik-"+path);
}
angular.module("adriatik").service("gameSocket", gameSocket);


