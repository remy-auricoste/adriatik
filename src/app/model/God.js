var God = Meta.declareClass("God", {
    name: "",
    color: "",
    building: "Building",
    unitType: "UnitType",
    unitPrice: "fct",
    card: "GodCard",
    cardPrice: "fct",
    index: 1,
    bid: {},
    playerNames: [],
    init: function () {
        if (!this.playerNames) {
            this.playerNames = [];
        }
        God.all[this.name] = this;
    },
    canBuild: function (building) {
        return building === this.building;
    }
});
God.all = {};
God.allArray = function() {
  return Object.keys(God.all).map(function(key) {
    return God.all[key];
  });
}
God.byName = function(name) {
  return God[name];
}
