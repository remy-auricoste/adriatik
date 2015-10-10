var classe = Meta.createClass("EventBus", {
  getListeners: function(channel) {
    var listenerGroup = this.listeners[channel];
    if (!listenerGroup) {
        listenerGroup = [];
        this.listeners[channel] = listenerGroup;
    }
    return listenerGroup;
  },
  addListener: function(channel, receiveFct) {
    if (receiveFct && typeof receiveFct === "function") {
      this.getListeners(channel).push(receiveFct);
    }
  },
  emit: function(channel, emitter, message) {
      message.channel = channel;
      Meta.foreach(this.getListeners(channel), function(listener) {
          listener({
            message: message,
            channel: channel,
            emitter: emitter
          });
      });
  },
  init: function () {
      this.listeners = {};
  }
});
window.EventBus = new classe();
