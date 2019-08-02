module.exports = function(UnitType, TerritoryType, Unit) {
  const { sea, earth } = TerritoryType;
  class FirstTurnActions {
    initUnit({ player, territory, game, god }) {
      const {
        turn,
        settings: { warMode }
      } = game;
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
        if (territory.type === sea) {
          const isAdjacentEarth = playerTerritories.some(territoryIte => {
            return (
              territoryIte.type === earth && territoryIte.isNextTo(territory)
            );
          });
          if (!isAdjacentEarth) {
            throw new Error(
              "vous devez placer vos bateaux sur des territoires adjacents à vos territoires terrestres"
            );
          }
        }
        const earthTerritories = playerTerritories.filter(
          territoryIte => earth === territoryIte.type
        );
        if (!territory.getOwner() && warMode && territory.type === earth) {
          if (earthTerritories.length === 2) {
            throw new Error(
              "vous devez prendre 2 territoires terrestres et 2 territoires maritimes contigus."
            );
          }
          const isAdjacent = earthTerritories.some(territoryIte => {
            return territoryIte.isNextTo(territory);
          });
          if (playerTerritories.length && !isAdjacent) {
            throw new Error(
              "il n'est pas adjacent aux territoires déjà contrôlés."
            );
          }
        }
        const unitType =
          territory.type === earth ? UnitType.Legionnaire : UnitType.Ship;
        const unitsLeft = this.getUnitsLeft({ game, god, player });
        const unitsOfTypeLeft = unitsLeft[unitType.id];
        if (!unitsOfTypeLeft) {
          throw new Error(
            "vous ne pouvez pas ajouter d'autres unités de type " +
              unitType.label +
              "."
          );
        }
        if (
          unitsOfTypeLeft === 1 &&
          territory.isOwner(player) &&
          earthTerritories.length < 2
        ) {
          throw new Error("vous devez prendre 2 territoires terrestres.");
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
    getUnitsLeft({ game, god, player }) {
      const playerTerritories = game.getTerritoriesForPlayer(player);
      const getAllowed = unitType => {
        return 2 + (god.unitType && god.unitType.id === unitType.id ? 1 : 0);
      };
      const getLeft = unitType => {
        const currentValue = playerTerritories
          .map(territory => territory.getUnitsOfType(player, unitType).length)
          .reduce((acc, value) => acc + value, 0);
        return getAllowed(unitType) - currentValue;
      };
      const result = {};
      const unitTypes = [UnitType.Legionnaire, UnitType.Ship];
      unitTypes.forEach(type => {
        result[type.id] = getLeft(type);
      });
      return result;
    }
  }
  return FirstTurnActions;
};
