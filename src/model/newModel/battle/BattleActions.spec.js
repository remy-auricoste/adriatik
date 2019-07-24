const Injector = require("../../../Injector");
const injector = Injector.instance;

const {
  BattleActions,
  DataTest,
  Game,
  GameActions,
  God,
  Unit,
  UnitType,
  Player
} = injector.resolveAll();

const { Minerve, Neptune } = God;
const { Legionnaire } = UnitType;

const { player, territory } = DataTest;

const actions = new BattleActions();
const gameActions = new GameActions();

const seq = (min, max) => {
  const result = [];
  for (let i = min; i < max; i++) {
    result.push(i);
  }
  return result;
};

const initState = ({ player1UnitCount, player2UnitCount = 0 }) => {
  const player2 = new Player({ id: "player2" });
  let fromTerritory = territory;
  seq(0, player1UnitCount).forEach(value => {
    fromTerritory = fromTerritory.placeUnit(
      new Unit({
        type: Legionnaire,
        ownerId: player.id
      })
    );
  });
  let toTerritory = territory.copy({ id: "toTerritory" });
  seq(0, player2UnitCount).forEach(value => {
    toTerritory = toTerritory.placeUnit(
      new Unit({
        type: Legionnaire,
        ownerId: player2.id
      })
    );
  });
  fromTerritory.nextTo(toTerritory);

  let game = new Game({
    territories: [fromTerritory, toTerritory],
    players: [player, player2],
    gods: [Minerve, Neptune]
  });

  game = gameActions.placeBid({ game, godId: Minerve.id, amount: 1 });
  return gameActions
    .placeBid({ game, godId: Neptune.id, amount: 1 })
    .then(game => {
      return {
        player,
        player2,
        fromTerritory,
        toTerritory,
        game
      };
    });
};

describe.only("BattleActions class", () => {
  describe("move method", () => {
    it("should move units from a territory to an empty territory", () => {
      return initState({ player1UnitCount: 3 }).then(init => {
        const { fromTerritory, toTerritory, game } = init;
        const { units } = fromTerritory;
        const movedUnits = [units[0], units[2]];
        const result = actions.move({
          game,
          units: movedUnits,
          fromTerritory,
          toTerritory
        });
        expect(result.getEntity(fromTerritory).units.length).to.equal(1);
        expect(result.getEntity(toTerritory).units.length).to.equal(2);
      });
    });
    it("should move a unit and fight to death", () => {
      return initState({ player1UnitCount: 1, player2UnitCount: 1 }).then(
        init => {
          const { fromTerritory, toTerritory, game } = init;
          const { units } = fromTerritory;
          const movedUnits = units;
          return actions
            .move({
              game,
              units: movedUnits,
              fromTerritory,
              toTerritory
            })
            .then(game => {
              expect(game.getEntity(fromTerritory).units.length).to.equal(0);
              expect(game.getEntity(toTerritory).units.length).to.equal(0);
            });
        }
      );
    });
  });
});
