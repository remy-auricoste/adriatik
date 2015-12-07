/** @ngInject */
function commandSocket(gameSocket) {
  'use strict';
  return gameSocket.subSocket("command");
}
angular.module("adriatik").service("commandSocket", commandSocket);


