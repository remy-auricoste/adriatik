module.exports = function(Unit, Building) {
  class Territory {
    constructor({
      buildings = [],
      units = [],
      neighbours = [],
      addedIncome = 0,
      baseIncome = 0,
      buildSlots = 0,
      id = Math.random() + "",
      path,
      box,
      type
    }) {
      this.buildings = buildings.map(_ => new Building(_));
      this.units = units.map(_ => new Unit(_));
      this.neighbours = neighbours.concat([]);
      this.addedIncome = addedIncome;
      this.baseIncome = baseIncome;
      this.buildSlots = buildSlots;
      this.type = type;
      this.id = id;
      this.path = path;
      this.box = box;
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
    placeUnits(units) {
      return units.reduce((acc, unit) => acc.placeUnit(unit), this);
    }
    removeUnit(unit) {
      const { units } = this;
      var index = units.findIndex(unitIte => {
        return (
          unit.type.id === unitIte.type.id && unit.ownerId === unitIte.ownerId
        );
      });
      if (!(typeof index === "number" && index >= 0)) {
        console.error(
          "impossible de retirer cette unité : ",
          unit,
          units,
          index
        );
        throw new Error(
          "impossible de retirer cette unité : " + unit.type.label
        );
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
      return units.reduce(
        (acc, unit) => {
          const [new1, new2] = acc;
          return new1.moveUnit(unit, new2);
        },
        [this, dest]
      );
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
      // TODO solve this as immutable
      this.neighbours.push(territory.id);
      territory.neighbours.push(this.id);
    }

    // reads
    isEmpty() {
      return this.units.length === 0;
    }
    isFriendly(player) {
      const owner = this.getOwner();
      return !owner || owner === player.id;
    }
    getUnits(player) {
      return this.units.filter(unit => {
        return unit.ownerId === player.id;
      });
    }
    getUnitsOfType(player, type) {
      return this.units.filter(unit => {
        return unit.ownerId === player.id && unit.type.id === type.id;
      });
    }
    getIncome() {
      return this.baseIncome + this.addedIncome;
    }
    hasConflict() {
      const { units } = this;
      if (!units.length) {
        return false;
      }
      const player1Id = units[0].ownerId;
      return !units.every(unit => {
        return unit.ownerId === player1Id;
      });
    }
    isNextTo(territory) {
      return this.neighbours.indexOf(territory.id) >= 0;
    }
    getOwner() {
      const firstUnit = this.units[0];
      return firstUnit && firstUnit.ownerId;
    }
    isOwner(player) {
      return this.getOwner() === player.id;
    }

    // private
    copy(params = {}) {
      return new Territory(Object.assign({}, this, params));
    }
  }
  return Territory;
};
