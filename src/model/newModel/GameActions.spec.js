const {
  Game,
  Player,
  GameActions,
  GameSettings,
  God,
  PhaseAction,
  Territory,
  TerritoryType,
  PhaseBid,
  Unit,
  UnitType
} = injector.resolveAll();

const commands = GameActions.commands();
const settings = new GameSettings();
const player1 = new Player({ gold: 7, id: "player1" });
const player2 = new Player({ gold: 7, id: "player2" });
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

const doSimpleBids = game => {
  const { gods } = game;
  game = commands.placeBid({ godId: gods[0].id, amount: 1 }).apply(game); // player2
  game = commands.placeBid({ godId: God.Ceres.id, amount: 0 }).apply(game); // player1
  return game;
};

const initGame = ({ withTurn1 = false } = {}) => {
  const players = [player1, player2];

  const game = new Game({ players, gods: settings.gods, territories });
  let promise = game.start();
  if (!withTurn1) {
    return promise;
  }
  return promise
    .then(doSimpleBids)
    .then(game => {
      // player 2
      game = commands.initUnit({ territoryId: territories[1].id }).apply(game); // earth
      game = commands.initUnit({ territoryId: territories[3].id }).apply(game); // earth
      game = commands.initUnit({ territoryId: territories[0].id }).apply(game); // sea
      game = commands.initUnit({ territoryId: territories[2].id }).apply(game); // sea
      game = commands.initUnit({ territoryId: territories[2].id }).apply(game); // sea
      return game;
    })
    .then(game => {
      // player 1
      game = commands.initUnit({ territoryId: territories[5].id }).apply(game); // earth
      game = commands.initUnit({ territoryId: territories[7].id }).apply(game); // earth
      game = commands.initUnit({ territoryId: territories[6].id }).apply(game); // sea
      game = commands.initUnit({ territoryId: territories[8].id }).apply(game); // sea
      return game;
    });
};

describe("GameActions class", () => {
  describe("2 turns", () => {
    it("should go well", () => {
      return initGame()
        .then(game => {
          const { gods, turn, players } = game;
          expect(turn).to.equal(1);
          expect(players).to.deep.equal([player2, player1]);
          game = commands
            .placeBid({ godId: gods[0].id, amount: 1 })
            .apply(game); // player2
          game = commands
            .placeBid({ godId: gods[0].id, amount: 2 })
            .apply(game); // player1
          game = commands
            .placeBid({ godId: God.Ceres.id, amount: 0 })
            .apply(game); // player2
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
          game = commands
            .initUnit({ territoryId: territories[1].id })
            .apply(game); // earth
          game = commands
            .initUnit({ territoryId: territories[3].id })
            .apply(game); // earth
          game = commands
            .initUnit({ territoryId: territories[0].id })
            .apply(game); // sea
          game = commands
            .initUnit({ territoryId: territories[2].id })
            .apply(game); // sea
          game = commands
            .initUnit({ territoryId: territories[2].id })
            .apply(game); // sea
          return game;
        })
        .then(game => {
          expect(game.getCurrentPlayer().id).to.equal(player2.id);
          game = commands
            .initUnit({ territoryId: territories[5].id })
            .apply(game); // earth
          game = commands
            .initUnit({ territoryId: territories[7].id })
            .apply(game); // earth
          game = commands
            .initUnit({ territoryId: territories[6].id })
            .apply(game); // sea
          game = commands
            .initUnit({ territoryId: territories[8].id })
            .apply(game); // sea
          return game;
        })
        .then(game => {
          const { players, bidState } = game;
          expect(game.getCurrentPlayer().id).to.equal(player1.id);
          expect(game.getCurrentPhase().constructor).to.equal(PhaseBid);
          expect(game.turn).to.equal(2);
          expect(players.map(x => x.id)).to.deep.equal([
            player1.id,
            player2.id
          ]);
          expect(players.map(x => x.gold)).to.deep.equal([7, 9]);
          expect(bidState.bids).to.deep.equal([]);
        });
    });
  });
  describe("build", () => {
    it("should throw if trying to build on a non-controlled territory", () => {
      return initGame({ withTurn1: true })
        .then(doSimpleBids)
        .then(game => {
          const territory = territories[5];
          expect(() => {
            commands.build({ territoryId: territory.id }).apply(game);
          }).to.throw(
            "Vous ne pouvez construire que sur des territoires que vous contrôlez"
          );
        });
    });
  });
  describe("pass", () => {
    it("should add 1 sesterce to Ceres player", () => {
      return initGame({ withTurn1: true })
        .then(game => {
          expect(game.turn).to.equal(2);
          expect(game.getEntityById(player1.id).gold).to.equal(9); // +2 from territories
          expect(game.getEntityById(player2.id).gold).to.equal(8); // -1 from bid, +2 from territories
          return game;
        })
        .then(doSimpleBids)
        .then(game => {
          expect(game.getEntityById(player1.id).gold).to.equal(9);
          expect(game.getEntityById(player2.id).gold).to.equal(7); // -1 from bid
          game = commands.pass().apply(game);
          game = commands.pass().apply(game);
          return game;
        })
        .then(game => {
          expect(game.turn).to.equal(3);
          expect(game.getEntityById(player1.id).gold).to.equal(12); // +2 from territories, +1 from Ceres
          expect(game.getEntityById(player2.id).gold).to.equal(9); // +2 from territories
        });
    });
  });
});
