var Fifo = Meta.createClass("Fifo", {
  items: [],
  size: 1,
  init: function() {
    if (!this.items) {
      this.items = [];
    }
    if (!this.size) {
      this.size = 10;
    }
  },
  push: function(item) {
    this.items.push(item);
    if (this.items.length > this.size) {
      this.items.splice(0, 1);
    }
  },
  getItems: function() {
    return this.items;
  }
})
