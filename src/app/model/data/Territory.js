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
    init: function () {
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
            this.id = idCount++ + "";
        }
        if (!this.addedIncome) {
          this.addedIncome = 0;
        }
        if (!this.income) {
          this.income = 0;
        }
        if (!this.buildSlots) {
          this.buildSlots = 0;
        }
    },
    placeUnit: function (unit) {
        if (unit.type.territoryType !== this.type) {
            throw new Error("il est impossible de placer ce type d'unité sur ce type de territoire.");
        }
        this.units.push(unit);
    },
    removeUnit: function (unit) {
        var index = this.units.indexOf(unit);
        if (index === -1) {
            throw new Error("Pas d'unité de ce type " + unit.type);
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
    }
});
Territory.byId = function (id) {
    return Territory._all[id];
}
