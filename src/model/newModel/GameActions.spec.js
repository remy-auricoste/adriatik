const Injector = require("../../Injector");
const injector = Injector.instance;

const {
  Game,
  Player,
  GameActions,
  GameSettings,
  God,
  PhaseAction,
  Territory,
  TerritoryType,
  FirstTurnActions,
  PhaseBid
} = injector.resolveAll();

const gameActions = new GameActions();
const commands = gameActions.commands();
const settings = new GameSettings();

const firstActions = new FirstTurnActions();

describe("GameActions class", () => {
  describe("2 turns", () => {
    it("should go well", () => {
      const player1 = new Player({ gold: 7, id: "player1" });
      const player2 = new Player({ gold: 7, id: "player2" });
      const players = [player1, player2];

      // 0 => sea
      // 1 => earth
      const terrainDef = [0, 1, 0, 1, 0, 1, 0, 1, 0];
      const territories = terrainDef.reduce((acc, value) => {
        const lastTerritory = acc[acc.length - 1];
        const territory = new Territory({
          type: value ? TerritoryType.earth : TerritoryType.sea,
          buildSlots: 4,
          baseIncome: value ? 1 : 0
        });
        lastTerritory && territory.nextTo(lastTerritory);
        return acc.concat([territory]);
      }, []);

      const game = new Game({ players, gods: settings.gods, territories });
      return game
        .start()
        .then(game => {
          const { gods, turn, players } = game;
          expect(turn).to.equal(1);
          expect(players).to.deep.equal([player2, player1]);
          game = commands.placeBid({ godId: gods[0].id, amount: 1 })(game); // player2
          game = commands.placeBid({ godId: gods[0].id, amount: 2 })(game); // player1
          game = commands.placeBid({ godId: God.Ceres.id, amount: 0 })(game); // player2
          return game;
        })
        .then(game => {
          const {
            bidState: { bids },
            players
          } = game;
          expect(bids).to.deep.equal([
            {
              godId: God.Neptune.id,
              amount: 2,
              playerId: player1.id
            },
            {
              godId: God.Ceres.id,
              amount: 0,
              playerId: player2.id
            }
          ]);
          expect(players).to.deep.equal([player1.copy({ gold: 5 }), player2]);
          expect(game.getCurrentPlayer().id).to.equal(player1.id);
          expect(game.getCurrentPhase().constructor).to.equal(PhaseAction);
          game = commands.initUnit({ territoryId: territories[1].id })(game); // earth
          game = commands.initUnit({ territoryId: territories[3].id })(game); // earth
          game = commands.initUnit({ territoryId: territories[0].id })(game); // sea
          game = commands.initUnit({ territoryId: territories[2].id })(game); // sea
          game = commands.initUnit({ territoryId: territories[2].id })(game); // sea
          return game;
        })
        .then(game => {
          expect(game.getCurrentPlayer().id).to.equal(player2.id);
          game = commands.initUnit({ territoryId: territories[5].id })(game); // earth
          game = commands.initUnit({ territoryId: territories[7].id })(game); // earth
          game = commands.initUnit({ territoryId: territories[6].id })(game); // sea
          game = commands.initUnit({ territoryId: territories[8].id })(game); // sea
          return game;
        })
        .then(game => {
          const { players, bidState } = game;
          expect(game.getCurrentPlayer().id).to.equal(player1.id);
          expect(game.getCurrentPhase().constructor).to.equal(PhaseBid);
          expect(players.map(x => x.id)).to.deep.equal([
            player1.id,
            player2.id
          ]);
          expect(players.map(x => x.gold)).to.deep.equal([7, 9]);
          expect(bidState.bids).to.deep.equal([]);
        });
    });
  });
});
