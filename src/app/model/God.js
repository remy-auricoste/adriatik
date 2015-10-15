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
  init: function() {
    if (!this.playerNames) {
      this.playerNames = [];
    }
  }
});
