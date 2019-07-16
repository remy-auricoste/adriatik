const Injector = require("../../Injector");
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

const { player, legionnaire, territory } = DataTest;

const actions = new BattleActions();
const gameActions = new GameActions();

describe.only("BattleActions class", () => {
  describe("move method", () => {
    it("should move units from a territory to an empty territory", () => {
      const units = [
        legionnaire.copy(),
        legionnaire.copy(),
        legionnaire.copy()
      ];
      const fromTerritory = territory.placeUnits(units);
      const toTerritory = territory.copy({ id: "toTerritory" });
      fromTerritory.nextTo(toTerritory);

      let game = new Game({
        territories: [fromTerritory, toTerritory],
        players: [player],
        gods: [Minerve]
      });

      const movedUnits = [units[0], units[2]];

      return gameActions
        .placeBid({ game, godId: Minerve.id, amount: 1 })
        .then(game => {
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
      const player2 = new Player({ id: "player2" });
      const movedUnit = new Unit({
        type: Legionnaire,
        ownerId: player.id
      });
      const fromTerritory = territory.placeUnits([movedUnit]);
      const toTerritory = territory.copy({ id: "toTerritory" }).placeUnits([
        new Unit({
          type: Legionnaire,
          ownerId: player2.id
        })
      ]);
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
          return actions.move({
            game,
            units: [movedUnit],
            fromTerritory,
            toTerritory
          });
        })
        .then(game => {
          expect(game.getEntity(fromTerritory).units.length).to.equal(0);
          expect(game.getEntity(toTerritory).units.length).to.equal(0);
        });
    });
  });
});
