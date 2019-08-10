module.exports = function(God) {
  return class PhaseAction {
    async start({ game }) {
      return game.copy({
        currentPlayerIndex: 0
      });
    }
    pass({ game }) {
      const { currentPlayerIndex, players } = game;
      const newPlayerIndex = currentPlayerIndex + 1;
      if (newPlayerIndex >= players.length) {
        return game.nextPhase();
      } else {
        return game.copy({
          currentPlayerIndex: newPlayerIndex
        });
      }
    }
    async end({ game }) {
      const { turn } = game;
      const { player, god } = game.getCurrentPlayerAndGod();
      if (god.id === God.Ceres.id && turn !== 1) {
        const territoriesOwnedCount = game.getTerritoriesForPlayer(player)
          .length;
        const earntGold = territoriesOwnedCount > 1 ? 1 : 4;
        const newPlayer = player.copy({ gold: player.gold + earntGold });
        game = game.updateAll({ player: newPlayer });
      }
      return game.copy({
        turn: turn + 1
      });
    }
  };
};
