module.exports = function(God, randomReaderAsync) {
  return class PhaseAction {
    async start({ game }) {
      return game;
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
      return game.copy({
        turn: turn + 1
      });
    }
  };
};