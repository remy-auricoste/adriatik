var Socket = require("rauricoste-websocket-room-client");

var addWindowCloseListener = function(fonction) {
  window.onbeforeunload = fonction;
}

var socket = new Socket({
      host: ["https://websocket-room-http.herokuapp.com:443/socket"]
//    host: ["http://localhost:8001/socket"]
});
module.exports = socket;


