module.exports = function(FirstTurnActions, Commandify, PhaseBid, God) {
  const { Ceres } = God;
  const firstActions = new FirstTurnActions();
  return class GameActions {
    initUnit({ territoryId, game }) {
      const territory = game.getEntityById(territoryId);
      const { player, god } = game.getCurrentPlayerAndGod();
      const result = firstActions.initUnit({ player, territory, game, god });
      const newGame = result.game;
      const unitsLeft = firstActions.getUnitsLeft({
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
      const { player, god } = game.getCurrentPlayerAndGod();
      const result = god.build({ player, territory });
      return game.updateAll(result);
    }
    pass({ game }) {
      const phase = game.getCurrentPhase();
      return phase.pass({ game });
    }
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
      const { turn } = game;
      const isBidPhase = game.getCurrentPhase().constructor === PhaseBid;
      if (isBidPhase) {
        return ["placeBid"];
      }
      if (turn === 1) {
        return ["initUnit"];
      }
      const { god } = game.getCurrentGod();
      const isCeres = Ceres.id === god.id;
      const result = ["pass"];
      if (isCeres) {
        return result;
      }
      if (god.unitType) {
        result.push("buyUnit");
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
        build: ["Territory"]
      };
    }
    canDo({ actionType, game }) {
      return this.getPossibleActionTypes({ game }).indexOf(actionType) !== -1;
    }
  };
};
