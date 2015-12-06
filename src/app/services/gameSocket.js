/** @ngInject */
function gameSocket(socket, $location) {
  'use strict';

  var path = $location.path();
  return socket.openRoom("adriatik-"+path);
}
angular.module("adriatik").service("gameSocket", gameSocket);


