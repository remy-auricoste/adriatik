var Socket = require("rauricoste-websocket-room-client");

var addWindowCloseListener = function(fonction) {
  window.onbeforeunload = fonction;
}

var socket = new Socket({
      host: ["http://websocket-room-http.herokuapp.com/socket"]
//    host: ["http://localhost:8001/socket"]
});
module.exports = socket;


