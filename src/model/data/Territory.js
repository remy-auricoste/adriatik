require("rauricoste-objects"); // polyfill
var Meta = require("../../alias/Meta");

var idCount = 0;
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
    _init: function () {
        if (!this.id) {
            this.id = idCount++ + "";
        }
    },
    placeUnit: function (unit) {
        if (unit.type.territoryType !== this.type) {
            throw new Error("il est impossible de placer ce type d'unité sur ce type de territoire.");
        }
        this.units.push(unit);
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
    isEmpty: function () {
        return this.units.length === 0;
    },
    nextTo: function (territory) {
        this.neighbours.push(territory.id);
        territory.neighbours.push(this.id);
    },
    isFriendly: function (player) {
        return !this.owner || this.owner === player;
    },
    getUnits: function (player) {
        return this.units.filter(function (unit) {
            return unit.owner === player;
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
      return this.neighbours.indexOf(territory.id) >= 0;
    },
    getNeighbours: function() {
      return this.neighbours.map(Territory.byId).filter(function(territory) {
        return !!territory;
      });
    }
});
Territory.byId = function (id) {
    return Territory._all[id];
}
Territory.allArray = function() {
  return Object.values(Territory._all);
}

module.exports = Territory;
