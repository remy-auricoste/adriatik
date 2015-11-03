var TimedArray = Meta.createClass("TimedArray", {
  items: [],
  ttl: 1,
  init: function() {
    if (!this.items) {
      this.items = [];
    }
    if (!this.ttl) {
      this.ttl = 1000;
    }
  },
  push: function(item) {
    var self = this;
    self.items.push({
      item: item,
      death: new Date().getTime() + self.ttl
    });
  },
  remove: function(item) {
    var index = Meta.findIndex(this.items, function(object) {
      return object.item === item;
    });
    if (index >= 0) {
      this.items.splice(index, 1);
    }
  },
  getItems: function() {
    var now = new Date().getTime();
    var filtered = this.items.filter(function(object) {
      return object.death > now;
    });
    this.items = filtered;
    return this.items.map(function(object) {
      return object.item;
    });
  }
})
