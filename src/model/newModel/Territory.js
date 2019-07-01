class Territory {
  constructor({
    buildings = [],
    units = [],
    neighbours = [],
    addedIncome = 0,
    baseIncome = 0,
    buildSlots = 0,
    type
  }) {
    this.buildings = buildings;
    this.units = units;
    this.neighbours = neighbours;
    this.addedIncome = addedIncome;
    this.baseIncome = baseIncome;
    this.buildSlots = buildSlots;
    this.type = type;
  }
  // writes
  placeUnit(unit) {
    const { units, type } = this;
    if (unit.type.territoryType !== type) {
      throw new Error(
        "il est impossible de placer ce type d'unité sur ce type de territoire."
      );
    }
    return this.copy({
      units: units.concat([unit])
    });
  }
  removeUnit(unit) {
    const { units } = this;
    var index = units.findIndex(function(unitIte) {
      return unit.type === unitIte.type && unit.owner === unitIte.owner;
    });
    if (!(typeof index === "number" && index >= 0)) {
      console.error("impossible de retirer cette unité : ", unit, units, index);
      throw new Error("impossible de retirer cette unité : " + unit.type.label);
    }
    const newUnits = units.concat([]);
    newUnits.splice(index, 1);
    return this.copy({
      units: newUnits
    });
  }
  moveUnit(unit, dest) {
    return [this.removeUnit(unit), dest.placeUnit(unit)];
  }
  moveUnits(units, dest) {
    return units.flatMap(unit => {
      return this.moveUnit(unit, dest);
    });
  }
  build(building) {
    const { buildSlots, buildings } = this;
    if (buildSlots <= 0) {
      throw new Error(
        "il n'y a aucun emplacement libre sur le territoire sélectionné."
      );
    }
    return this.copy({
      buildSlots: buildSlots - 1,
      buildings: buildings.concat([building])
    });
  }
  nextTo(territory) {
    this.neighbours.push(territory.index);
    territory.neighbours.push(this.index);
  }

  // reads
  isEmpty() {
    return this.units.length === 0;
  }
  isFriendly(player) {
    return !this.owner || this.owner === player.name;
  }
  getUnits(player) {
    return this.units.filter(function(unit) {
      return unit.owner === player.name;
    });
  }
  getUnitsOfType(player, type) {
    return this.units.filter(function(unit) {
      return unit.owner === player.name && unit.type === type;
    });
  }
  getIncome() {
    return this.baseIncome + this.addedIncome;
  }
  hasConflict() {
    if (!this.units.length) {
      return false;
    }
    var player1 = this.units[0].owner;
    return !!this.units.find(function(unit) {
      return unit.owner !== player1;
    });
  }
  isNextTo(territory) {
    return this.neighbours.indexOf(territory.index) >= 0;
  }

  // private
  copy(params = {}) {
    return new Territory(Object.assign({}, this, params));
  }
}

module.exports = Territory;
