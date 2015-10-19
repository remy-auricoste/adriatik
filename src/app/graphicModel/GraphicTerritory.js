var GraphicTerritory = Meta.createClass("GraphicTerritory", {
  path: "",
  territory: "Territory",
  box: {},
  left: function(index, unitSize) {
    return Math.round(this.box.x + (this.box.width-unitSize) / 2);
  },
  top: function(index, unitSize) {
    return Math.round(this.box.y + (this.box.height-unitSize) / 2);
  }
});
