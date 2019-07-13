module.exports = function(God, randomReaderAsync) {
  const { Ceres } = God;
  return class PhaseBid {
    async start({ game }) {
      const { turn, players, creatureMarket, settings } = game;
      const normalGods = settings.gods.filter(god => god !== Ceres);
      const godPromise = randomReaderAsync
        .shuffle(normalGods)
        .then(shuffled => {
          const newGods = shuffled.slice(0, players.length - 1).concat([Ceres]);
          return newGods.map((god, index) => god.copy({ index }).init());
        });
      const newPlayers =
        turn === 1
          ? players
          : players.map(player => {
              const income = game.getIncome(player);
              return player.income(income);
            });
      const creaturesPromise =
        turn === 1
          ? Promise.resolve()
          : creatureMarket.pushCreatures(turn === 2 ? 1 : 3);
      const [newGods, newCreatureMarket] = await Promise.all([
        godPromise,
        creaturesPromise
      ]);
      return game.copy({
        gods: newGods,
        players: newPlayers,
        creatureMarket: newCreatureMarket,
        currentPlayerIndex: 0
      });
    }
    pass({ game }) {
      const { players, bidState } = game;
      const freePlayers = players.filter(player => {
        return !bidState.getBidForPlayer(player);
      });
      if (freePlayers.length) {
        const newIndex = players.indexOf(freePlayers[0]);
        return game.copy({
          currentPlayerIndex: newIndex
        });
      } else {
        return game.nextPhase();
      }
    }
    async end({ game }) {
      const { players, bidState, gods } = game;
      const newPlayers = players.map(player => {
        const bid = bidState.getBidForPlayer(player);
        if (!bid) {
          console.error("player", player);
          console.error("bidState", bidState);
          throw new Error(`weird state : no bid for player ${player.id}`);
        }
        return player.payBid(bid.amount);
      });
      const ceresPlayers = newPlayers.filter(player => {
        const bid = bidState.getBidForPlayer(player);
        return bid.godId === Ceres.id;
      });
      const nonCeresPlayers = newPlayers.filter(player => {
        const bid = bidState.getBidForPlayer(player);
        return bid.godId !== Ceres.id;
      });
      const getGodIndex = player => {
        const bid = bidState.getBidForPlayer(player);
        const godIndex = gods.findIndex(god => god.id === bid.godId);
        if (typeof godIndex !== "number" || godIndex) {
          throw new Error(`inconsistent state : godIndex=${godIndex}`);
        }
        return godIndex;
      };
      const sortedPlayers = nonCeresPlayers
        .sort((a, b) => getGodIndex(a) - getGodIndex(b))
        .concat(ceresPlayers);

      return game.copy({
        players: sortedPlayers
      });
    }
    name() {
      return "Enchères";
    }
  };
};
