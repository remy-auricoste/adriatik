module.exports = function(UnitType, TerritoryType, Unit) {
  const { sea, earth } = TerritoryType;
  class FirstTurnActions {
    initUnit({ player, territory, game, god }) {
      const { turn, warMode } = game;
      if (turn !== 1) {
        throw new Error(
          "dev error: you cannot use this method if it is not turn 1."
        );
      }
      try {
        if (!territory.isFriendly(player)) {
          throw new Error(
            "vous devez contrôler le territoire ou le territoire doit être neutre."
          );
        }
        const playerTerritories = game.getTerritoriesForPlayer(player);
        if (!territory.getOwner()) {
          if (territory.type === sea) {
            const isAdjacentEarth = playerTerritories.some(territoryIte => {
              return territoryIte.type === earth;
            });
            if (!isAdjacentEarth) {
              throw new Error(
                "vous devez placer vos bateaux sur des territoires adjacents à vos territoires terrestres"
              );
            }
          }
          if (warMode) {
            const sameTypeTerritories = playerTerritories.filter(
              territoryIte => territory.type === territoryIte.type
            );
            if (sameTypeTerritories.length === 2) {
              throw new Error(
                "vous devez prendre 2 territoires terrestres et 2 territoires maritimes contigus."
              );
            }
            const isAdjacent = playerTerritories.some(territoryIte => {
              return territoryIte.isNextTo(territory);
            });
            if (playerTerritories.length && !isAdjacent) {
              throw new Error(
                "il n'est pas adjacent aux territoires déjà contrôlés."
              );
            }
          }
        }
        const unitType =
          territory.type === earth ? UnitType.Legionnaire : UnitType.Ship;
        const currentValue = playerTerritories
          .map(territory => territory.getUnitsOfType(player, unitType).length)
          .sum();
        const allowedValue =
          2 + (god.unitType && god.unitType === unitType ? 1 : 0);
        if (currentValue === allowedValue) {
          throw new Error(
            "vous ne pouvez pas ajouter d'autres unités de type " +
              unitType.label +
              "."
          );
        }
        if (currentValue === allowedValue - 1 && territory.isOwner(player)) {
          throw new Error(
            "vous devez prendre 2 territoires terrestres et 2 territoires maritimes contigus."
          );
        }
        const unit = new Unit({
          type: unitType,
          ownerId: player.id
        });
        const newTerritory = territory.placeUnit(unit);
        return {
          territory: newTerritory,
          game: game.update(newTerritory)
        };
      } catch (err) {
        throw err.prefix(
          "Il est impossible de placer une unité sur ce territoire : "
        );
      }
    }
  }
  return FirstTurnActions;
};
