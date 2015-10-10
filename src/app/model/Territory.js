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
    if (!this.neighbours) {
      this.neighbours = [];
    }
    if (!this.id) {
      this.id = Math.random() + "";
    }
  },
  placeUnit: function(unit) {
    if (unit.territoryType !== this.type) {
      throw new Error("impossible de placer ce type d'unité sur ce type de territoire");
    }
    this.units.push(unit);
  },
  removeUnit: function(unit) {
    var index = this.units.indexOf(unit);
    if (index === -1) {
      throw new Error("there is no unit of type "+unit.type);
    }
    this.units.splice(index, 1);
  },
  moveUnit: function(unit, dest) {
    this.removeUnit(unit);
    dest.placeUnit(unit);
  },
  moveUnits: function(units, dest) {
    var self = this;
    units.map(function(unit) {
      self.moveUnit(unit, dest);
    });
  },
  isEmpty: function() {
    return this.units.length === 0;
  },
  nextTo: function(territory) {
    this.neighbours.push(territory.id);
    territory.neighbours.push(this.id);
  }
})
