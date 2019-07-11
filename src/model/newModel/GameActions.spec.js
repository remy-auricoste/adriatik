const Injector = require("../../Injector");
const injector = Injector.instance;

const { Game, Player, GameActions, GameSettings } = injector.resolveAll();

const gameActions = new GameActions();
const settings = new GameSettings();

describe.only("GameActions class", () => {
  describe("2 turns", () => {
    it("should go well", () => {
      const player = new Player({ gold: 7, id: "player1" });
      const player2 = new Player({ gold: 7, id: "player2" });
      const players = [player, player2];
      const game = new Game({ players, gods: settings.gods });
      return game
        .start()
        .then(game => {
          const { gods, turn } = game;
          expect(turn).to.equal(1);
          return gameActions.placeBid({ game, godId: gods[0].id, amount: 1 });
        })
        .then(game => {
          console.log(game.bidState);
        });
    });
  });
});
