module.exports = function(
  GameActions,
  storeCommands,
  store,
  commandHandler,
  SelectionActions,
  TerritoryType,
  BattleActions,
  UnitMove
) {
  const { sea, earth } = TerritoryType;

  class MoveActions {
    constructor() {
      this.reset();
    }
    reset() {
      storeCommands.set("move", { units: [] });
    }
    select(unit, territory) {
      SelectionActions.reset();
      const { fromTerritory } = this.getState();
      if (
        fromTerritory &&
        territory.id !== fromTerritory.id &&
        fromTerritory.type === earth
      ) {
        this.reset();
      }
      storeCommands.push("move.orderedTerritories", territory);
      storeCommands.push("move.fromTerritory", territory);
      storeCommands.push("move.units", unit);
    }
    selectTerritory(territory) {
      const { units, fromTerritory } = this.getState();
      if (!units.length || territory.id === fromTerritory.id) {
        this.reset();
        return;
      }
      storeCommands.push("move.orderedTerritories", territory);
      const { game } = store.getState();
      const { type: territoryType } = territory;
      if (territoryType === sea) {
        storeCommands.push(
          "move.unitMoves",
          new UnitMove({
            unit: units[0],
            fromTerritory: fromTerritory[0],
            toTerritory: territory
          })
        );
        storeCommands.set("move.units", units.slice(1));
        storeCommands.set("move.fromTerritory", fromTerritory.slice(1));
        if (!this.getState().units.length) {
          const { unitMoves, orderedTerritories } = this.getState();
          const command = GameActions.commands().moveSea({
            game,
            unitMoves,
            orderedTerritories
          });
          commandHandler({ command });
          this.reset();
        }
      } else {
        const unitMoves = units.map(unit => {
          return new UnitMove({
            unit,
            fromTerritory: fromTerritory[0],
            toTerritory: territory
          });
        });
        const command = GameActions.commands().moveEarth({
          game,
          unitMoves
        });
        commandHandler({ command });
        this.reset();
      }
    }
    getSelectedUnits() {
      return this.getState().units;
    }
    getState() {
      return store.getState().move;
    }
    getAppliedGame({ game }) {
      const { unitMoves = [] } = this.getState();
      return unitMoves.reduce((gameAcc, move) => {
        return move.apply(gameAcc);
      }, game);
    }
    isValidSeaDestination(territory) {
      const selectedUnits = this.getSelectedUnits();
      if (!selectedUnits.length) {
        return false;
      }
      const { game } = store.getState();
      const currentPlayer = game.getCurrentPlayer();
      const fromTerritory = this.getState().fromTerritory;
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
