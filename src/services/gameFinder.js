var socket = require("./socket");

var gameFinder = {
  search: {},
  find: function(playerSize) {
    var roomSocket = socket.openRoomSocket("adriatik-search-"+playerSize);
    roomSocket.addRoomListener(function(messageObj) {
      if (messageObj.members.length >= playerSize) {
        roomSocket.send({command: "READY"})
      }
    });

    var self = this;
    var array = new TimedArray({ttl: 10000});
    var listener = roomSocket.addListener(function(messageObj) {
      var command = messageObj.message.command;
      if (command === "READY") {
        array.push(messageObj.source);
        var items = array.getItems();
        if (items.length === playerSize && items.indexOf(roomSocket.getId()) >= 0) {
          var gameId = Meta.sum(items.map(function(id) {
            return id.hashCode();
          }));
          window.location.href = "/game/"+playerSize+"/"+gameId;
        }
      }
    });
  },
  findFast: function() {
    return this.find(4);
  }
}

module.exports = gameFinder;
