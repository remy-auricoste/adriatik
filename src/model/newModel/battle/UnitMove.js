module.exports = class UnitMove {
  constructor({ unit, fromTerritory, toTerritory }) {
    this.unit = unit;
    this.fromTerritory = fromTerritory;
    this.toTerritory = toTerritory;
  }
  apply(game) {
    const { unit, fromTerritory, toTerritory } = this;
    const beforeFrom = game.getEntityById(fromTerritory.id);
    const beforeTo = game.getEntityById(toTerritory.id);
    const newTerritories = beforeFrom.moveUnits([unit], beforeTo);
    const [fromNew, toNew] = newTerritories;
    return game.update(fromNew).update(toNew);
  }
};
