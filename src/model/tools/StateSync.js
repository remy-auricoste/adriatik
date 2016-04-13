var Meta = require("../../alias/Meta");

function StateSync(socket) {
  this.socket = socket;
  this.syncMap = {};
}
StateSync.prototype.syncListener = function(onStart, onSync) {
  var self = this;
  Meta.requireType(onSync, "function");
  Meta.requireType(onStart, "function");
  var listener = self.socket.addListener(function(messageObj) {
    var source = messageObj.source;
    var id = messageObj.message.id;
    var size = messageObj.message.size;
    var value = messageObj.message.value;

    var stored = self.syncMap[id];
    if (!stored) {
      stored = {
        starter: source,
        id: id,
        size: size,
        values: {}
      };
      self.syncMap[id] = stored;
      if (source !== self.socket.getId()) {
        onStart(id, size, value);
      }
    }
    stored.values[source] = value;
    if (Object.keys(stored.values).length === size) {
      onSync(stored);
      delete self.syncMap[id];
    }
  });
  return listener;
}
StateSync.prototype.send = function(id, size, value) {
  var self = this;
  var stored = this.syncMap[id];
  if (!stored) {
    stored = {
      starter: self.socket.getId(),
      id: id,
      size: size,
      values: {}
    }
    this.syncMap[id] = stored;
  }
  return this.socket.send({
    id: id,
    size: size,
    value: value
  });
}

module.exports = StateSync;
