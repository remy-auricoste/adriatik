module.exports = function(
  GameActions,
  storeCommands,
  store,
  commandHandler,
  SelectionActions
) {
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
      const command = GameActions.commands().moveEarth({
        game,
        units,
        fromTerritory,
        toTerritory: territory
      });
      console.log(command);
      commandHandler({ command });
      this.reset();
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
