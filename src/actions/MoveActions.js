module.exports = function(
  GameActions,
  storeCommands,
  store,
  commandHandler,
  SelectionActions,
  TerritoryType,
  BattleActions
) {
  const { sea, earth } = TerritoryType;
  storeCommands.set("move", { units: [] });

  class MoveActions {
    reset() {
      storeCommands.set("move", { units: [] });
    }
    select(unit, territory) {
      SelectionActions.reset();
      const { fromTerritory } = this.getState();
      if (fromTerritory && territory.id !== fromTerritory.id) {
        this.reset();
      }
      storeCommands.set("move.fromTerritory", territory);
      storeCommands.push("move.units", unit);
    }
    selectTerritory(territory) {
      const { units, fromTerritory } = this.getState();
      if (!units.length || territory.id === fromTerritory.id) {
        this.reset();
        return;
      }
      const { game } = store.getState();
      const { type: territoryType } = fromTerritory;
      const actionMethod = territoryType === earth ? "moveEarth" : "moveSea";
      const command = GameActions.commands()[actionMethod]({
        game,
        units,
        fromTerritory,
        toTerritory: territory
      });
      commandHandler({ command });
      this.reset();
    }
    getSelectedUnits() {
      return this.getState().units;
    }
    getState() {
      return store.getState().move;
    }
    isValidSeaDestination(territory) {
      const selectedUnits = this.getSelectedUnits();
      if (!selectedUnits.length) {
        return false;
      }
      const { game } = store.getState();
      const currentPlayer = game.getCurrentPlayer();
      const {
        currentSeaMove: { territory: currentTerritory, remaining }
      } = currentPlayer;
      const fromTerritory = remaining
        ? currentTerritory
        : this.getState().fromTerritory;
      if (!fromTerritory) {
        return false;
      }
      try {
        BattleActions.checkSeaRange({
          game,
          player: currentPlayer,
          fromTerritory,
          toTerritory: territory
        });
        return true;
      } catch (err) {
        return false;
      }
    }
  }
  return new MoveActions();
};
