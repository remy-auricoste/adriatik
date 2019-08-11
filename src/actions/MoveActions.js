module.exports = function(BattleActions, storeCommands, store, commandHandler) {
  const battleActions = new BattleActions();
  storeCommands.set("move", { units: [] });

  class MoveActions {
    resetSelection() {
      storeCommands.set("move", { units: [] });
    }
    select(unit, territory) {
      const { fromTerritory } = this.getState();
      if (fromTerritory && territory.id !== fromTerritory.id) {
        this.resetSelection();
      }
      storeCommands.set("move.fromTerritory", territory);
      storeCommands.push("move.units", unit);
    }
    selectTerritory(territory) {
      const { units, fromTerritory } = this.getState();
      if (!units.length) {
        return;
      }
      const { game } = store.getState();
      const command = battleActions.commands().move({
        game,
        units,
        fromTerritory,
        toTerritory: territory
      });
      console.log(command);
      commandHandler({ command });
      this.resetSelection();
    }
    getSelectedUnits() {
      return this.getState().units;
    }
    getState() {
      return store.getState().move;
    }
  }
  return new MoveActions();
};
