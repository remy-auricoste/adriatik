const Injector = require("../../Injector");
const injector = Injector.instance;

const { God, Game, Player } = injector.resolveAll();

describe.only("Game class", () => {
  describe("start method", () => {
    it("should return a promise containing a game with shuffled gods, turn incremented, and no income distributed", () => {
      const player = new Player({ gold: 7, id: "player1" });
      const player2 = new Player({ gold: 7, id: "player2" });
      const players = [player, player2];
      const game = new Game({ players });
      return game.start().then(newGame => {
        const { gods, turn, players, creatureMarket } = newGame;
        expect(turn).to.equal(1);
        expect(players).to.deep.equal(players);
        expect(gods.length).to.deep.equal(2);
        expect(gods[gods.length - 1]).to.deep.equal(
          God.Ceres.copy({ index: 1 })
        );
        expect(creatureMarket.creaturesDiscard).to.deep.equal([]);
        expect(creatureMarket.creaturesDisplay).to.deep.equal([]);
      });
    });
  });
});
