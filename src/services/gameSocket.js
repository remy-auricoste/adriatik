var socket = require("./socket");

var path = window.location.pathname;
module.exports = socket.openRoom("adriatik-"+path);


