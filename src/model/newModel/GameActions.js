module.exports = function(FirstTurnActions) {
  const firstActions = new FirstTurnActions();
  return class GameActions {
    initUnit({ territoryId, game }) {
      const territory = game.getEntityById(territoryId);
      const { player, god } = game.getCurrentPlayerAndGod();
      const result = firstActions.initUnit({ player, territory, game, god });
      return game.updateAll(result);
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
      const result = god.buyUnit({ territory, player });
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
  };
};
