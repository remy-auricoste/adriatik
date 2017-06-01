require("rauricoste-objects"); // polyfill
var Meta = require("../../alias/Meta");

var Territory = Meta.declareClass("Territory", {
    _primary: "id",
    id: "",
    path: "",
    box: {},
    neighbours: [],
    income: 1,
    addedIncome: 1,
    type: "", // earth / sea
    units: ["Unit"],
    buildings: ["Building"],
    buildSlots: 1,
    owner: "Player",
    _defaults: {
      buildings: [],
      units: [],
      neighbours: [],
      addedIncome: 0,
      income: 0,
      buildSlots: 0
    },
    placeUnit: function (unit) {
        if (unit.type.territoryType !== this.type) {
            throw new Error("il est impossible de placer ce type d'unité sur ce type de territoire.");
        }
        var self = this.copy();
        self.units = self.units.concat([]);
        self.units.push(unit);
        return self;
    },
    removeUnit: function (unit) {
        var index = this.units.findIndex(function(unitIte) {
          return unit.type === unitIte.type && unit.owner === unitIte.owner;
        });
        if (!(typeof index === "number" && index >= 0)) {
            console.error("impossible de retirer cette unité : ", unit, this.units, index);
            throw new Error("impossible de retirer cette unité : " + unit.type.label);
        }
        this.units.splice(index, 1);
    },
    moveUnit: function (unit, dest) {
        this.removeUnit(unit);
        dest.placeUnit(unit);
    },
    moveUnits: function (units, dest) {
        var self = this;
        units.map(function (unit) {
            self.moveUnit(unit, dest);
        });
    },
    build: function(building) {
      if (this.buildSlots <= 0) {
        throw new Error("il n\'y a aucun emplacement libre sur le territoire sélectionné.");
      }
      var self = this.copy({buildSlots: this.buildSlots - 1});
      self.buildings = self.buildings.concat([]);
      self.buildings.push(building);
      return self;
    },
    isEmpty: function () {
        return this.units.length === 0;
    },
    nextTo: function (territory) {
        this.neighbours.push(territory.index);
        territory.neighbours.push(this.index);
    },
    isFriendly: function (player) {
        return !this.owner || this.owner === player.name;
    },
    getUnits: function (player) {
        return this.units.filter(function (unit) {
            return unit.owner === player.name;
        });
    },
    getUnitsOfType: function(player, type) {
        return this.units.filter(function (unit) {
            return unit.owner === player.name && unit.type === type;
        });
    },
    getIncome: function() {
      return this.income + this.addedIncome;
    },
    hasConflict: function() {
      if (!this.units.length) {
        return false;
      }
      var player1 = this.units[0].owner;
      return !!this.units.find(function(unit) {
        return unit.owner !== player1;
      });
    },
    isNextTo: function(territory) {
      return this.neighbours.indexOf(territory.index) >= 0;
    }
});

module.exports = Territory;
