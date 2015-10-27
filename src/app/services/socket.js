/** @ngInject */
function socket() {
  'use strict';

  var addWindowCloseListener = function(fonction) {
    window.onbeforeunload = fonction;
  }

  var socket = new Socket({
      host: ["http://websocket-room-http.herokuapp.com/socket"]
//      host: ["http://localhost:8001/socket"]
  });
  return socket;
}
angular.module("adriatik").service("socket", socket);


