/** @ngInject */
function randomSocket(gameSocket) {
  'use strict';

  return {
    hashSocket: gameSocket.subSocket("random-hash"),
    valueSocket: gameSocket.subSocket("random-value")
  }
}
angular.module("adriatik").service("randomSocket", randomSocket);


