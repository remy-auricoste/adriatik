/** @ngInject */
function socket() {
  'use strict';

  var addWindowCloseListener = function(fonction) {
    window.onbeforeunload = fonction;
  }

  var socket = new Socket({
      host: ["websocket-room-http.herokuapp.com"]
//      host: ["localhost:8001"]
  });
  return socket;
}
angular.module("adriatik").service("socket", socket);


