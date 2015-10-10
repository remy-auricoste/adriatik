var Territory = Meta.declareClass("Territory", {
  id: "",
  neighbours: [],
  income: 1,
  type: "", // earth / sea
  units: ["Unit"],
  buildings: ["Building"],
  buildSlots: 1,
  owner: "Player",
  init: function() {
    if (!this.buildings) {
      this.buildings = [];
    }
    if (!this.units) {
      this.units = [];
    }
  },
  placeUnit: function(unit) {
    if (unit.territoryType !== this.type) {
      throw new Error("impossible de placer ce type d'unité sur ce type de territoire");
    }
    this.units.push(unit);
  }
})
