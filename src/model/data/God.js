var Meta = require("../../alias/Meta");

var God = Meta.declareClass("God", {
    _primary: "name",
    name: "",
    color: "",
    building: "Building",
    unitType: "UnitType",
    unitPrice: "fct",
    card: "GodCard",
    cardPrice: "",
    index: 1,
    bid: "Bid",
    canBuild: function (building) {
        return building === this.building;
    }
});
God.allArray = function() {
  return Object.keys(God._all).map(function(key) {
    return God._all[key];
  });
}
God.byName = function(name) {
  return God._all[name];
}

module.exports = God;
