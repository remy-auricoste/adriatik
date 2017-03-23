var Socket = require("rauricoste-websocket-room-client");
var config = require("./config");
var logger = require("../alias/Logger").getLogger("socket");

var addWindowCloseListener = function(fonction) {
  window.onbeforeunload = fonction;
}

var hostName = config.isLocal() ? "http://localhost:8001/socket" : "https://websocket-room-http.herokuapp.com:443/socket";
logger.info("connecting to socket", hostName);
module.exports = new Socket(hostName);


