module.exports = function(
  FirstTurnActions,
  Commandify,
  PhaseBid,
  God,
  BattleActions,
  UnitType
) {
  const { Ceres } = God;
  class GameActions {
    // actions
    initUnit({ territoryId, game }) {
      const territory = game.getEntityById(territoryId);
      const { player, god } = game.getCurrentPlayerAndGod();
      const result = FirstTurnActions.initUnit({
        player,
        territory,
        game,
        god
      });
      const newGame = result.game;
      const unitsLeft = FirstTurnActions.getUnitsLeft({
        game: newGame,
        god,
        player
      });
      const totalLeft = Object.values(unitsLeft).reduce(
        (acc, value) => acc + value,
        0
      );
      return totalLeft ? newGame : this.pass({ game: newGame });
    }
    placeBid({ game, godId, amount }) {
      const { bidState } = game;
      const player = game.getCurrentPlayer();
      const god = game.getEntityById(godId);
      const newGame = game.copy({
        bidState: bidState.placeBid({ player, god, amount })
      });
      return this.pass({ game: newGame });
    }
    buyUnit({ game, territoryId }) {
      const territory = game.getEntityById(territoryId);
      const { player, god } = game.getCurrentPlayerAndGod();
      const result = god.buyUnit({ territory, player, game });
      return game.updateAll(result);
    }
    buyGodCard({ game }) {
      const { player, god } = game.getCurrentPlayerAndGod();
      const result = god.buyGodCard({ player });
      return game.updateAll(result);
    }
    build({ game, territoryId }) {
      const territory = game.getEntityById(territoryId);
      if (!territory) {
        throw new Error(
          `dev error : could not find territory with id=${territoryId}`
        );
      }
      const { player, god } = game.getCurrentPlayerAndGod();
      if (territory.getOwner() !== player.id) {
        throw new Error(
          `Vous ne pouvez construire que sur des territoires que vous contrôlez`
        );
      }
      const result = god.build({ player, territory });
      return game.updateAll(result);
    }
    pass({ game }) {
      const phase = game.getCurrentPhase();
      return phase.pass({ game });
    }
    stay({ game, player }) {
      return BattleActions.stay({ game, player });
    }
    moveEarth({ game, unitMoves }) {
      return BattleActions.moveEarth({ game, unitMoves });
    }
    moveSea({ game, unitMoves, orderedTerritories }) {
      return BattleActions.moveSea({ game, unitMoves, orderedTerritories });
    }
    retreat({ game, player, toTerritory }) {
      return BattleActions.retreat({ game, player, toTerritory });
    }

    // reads
    commands() {
      return Commandify(this, {
        wrapper: command => {
          const { object, method, args } = command;
          const params = args[0];
          return Object.assign(command, {
            apply: game => {
              const newArgs = [Object.assign({ game }, params)];
              const newCommand = { object, method, args: newArgs };
              return Commandify.applyCommand(this, newCommand);
            }
          });
        }
      });
    }
    getPossibleActionTypes({ game }) {
      const { turn, battle } = game;
      const isBidPhase = game.getCurrentPhase().constructor === PhaseBid;
      if (isBidPhase) {
        return ["placeBid"];
      }
      if (turn === 1) {
        return ["initUnit"];
      }
      if (battle && !battle.isDone()) {
        return ["stay", "retreat"];
      }

      const god = game.getCurrentGod();
      const { unitType } = god;
      const isCeres = Ceres.id === god.id;
      const result = ["pass"];
      if (isCeres) {
        return result;
      }
      if (unitType) {
        result.push("buyUnit");
        if (unitType.id === UnitType.Legionnaire.id) {
          result.push("moveEarth");
        } else {
          result.push("moveSea");
        }
      }
      if (god.card) {
        result.push("buyGodCard");
      }
      // TODO move and retreat
      result.push("build");
      return result;
    }
    getActionCommandTypings() {
      return {
        buyUnit: ["Territory"],
        buyGodCard: [],
        build: ["Territory"],
        pass: []
      };
    }
    canDo({ actionType, game }) {
      return this.getPossibleActionTypes({ game }).indexOf(actionType) !== -1;
    }
  }
  return new GameActions();
};
