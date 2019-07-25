const Injector = require("../../Injector");
const injector = Injector.instance;

const {
  DataTest,
  FirstTurnActions,
  Player,
  UnitType,
  God,
  GameSettings,
  TerritoryType,
  Game
} = injector.resolveAll();

const { player } = DataTest;
const god = God.Neptune;

const firstTurnActions = new FirstTurnActions();

describe("FirstTurnActions class", () => {
  describe("initUnit method", () => {
    it("should place a unit on 2 empty territories", () => {
      const territory = DataTest.territory.copy();
      const territory2 = territory.copy({ id: "territory2" });
      territory.nextTo(territory2);
      const game = new Game({ territories: [territory, territory2] });

      // when
      let result;
      result = firstTurnActions.initUnit({
        player,
        territory,
        game,
        god
      });
      result = firstTurnActions.initUnit({
        player,
        territory: territory2,
        game: result.game,
        god
      });
      const resultTerritory = result.game.getEntity(territory);
      expect(resultTerritory.getOwner()).to.equal(player.id);
      expect(resultTerritory.units.length).to.equal(1);
      expect(resultTerritory.units[0].type).to.equal(UnitType.Legionnaire);
      expect(result.game.getEntity(territory2).getOwner()).to.equal(player.id);
    });
    it("should throw an exception if the territory is already controlled by another player", () => {
      const territory = DataTest.territory.copy();
      const player2 = new Player();
      const game = new Game({ territories: [territory] });

      let result;
      result = firstTurnActions.initUnit({
        player,
        territory,
        game,
        god
      });
      expect(() => {
        result = firstTurnActions.initUnit({
          player: player2,
          territory: result.territory,
          game: result.game,
          god
        });
      }).to.throw(
        "Il est impossible de placer une unité sur ce territoire : vous devez contrôler le territoire ou le territoire doit être neutre."
      );
    });
    it("should throw an exception if trying to place unit on a 3rd territory", () => {
      const territory = DataTest.territory.copy();
      const territory2 = territory.copy({ id: "territory2" });
      const territory3 = territory.copy({ id: "territory3" });
      territory.nextTo(territory2);

      const game = new Game({
        territories: [territory, territory2, territory3]
      });

      // when
      let result;
      result = firstTurnActions.initUnit({
        player,
        territory,
        game,
        god
      });
      result = firstTurnActions.initUnit({
        player,
        territory: territory2,
        game: result.game,
        god
      });

      // then
      expect(() => {
        result = firstTurnActions.initUnit({
          player,
          territory: territory3,
          game: result.game,
          god
        });
      }).to.throw(
        "Il est impossible de placer une unité sur ce territoire : vous ne pouvez pas ajouter d'autres unités de type Légionnaire."
      );
    });
    it("should throw an exception if trying to place unit on non-adjacent territories (war mode)", () => {
      const territory = DataTest.territory;
      const territory2 = territory.copy({ id: "territory2" });
      const game = DataTest.game.copy({
        settings: new GameSettings({ warMode: true }),
        turn: 1,
        territories: [territory, territory2]
      });

      // when
      let result;
      result = firstTurnActions.initUnit({
        player,
        territory,
        game,
        god
      });

      // then
      expect(() => {
        result = firstTurnActions.initUnit({
          player,
          territory: territory2,
          game: result.game,
          god
        });
      }).to.throw(
        "Il est impossible de placer une unité sur ce territoire : il n'est pas adjacent aux territoires déjà contrôlés."
      );
    });
    it("should place 3 legionnaires with Minerve", () => {
      const god = God.Minerve;
      const territory = DataTest.territory.copy();
      const territory2 = territory.copy({ id: "territory2" });
      territory.nextTo(territory2);

      const game = new Game({ territories: [territory, territory2] });

      // when
      let result;
      result = firstTurnActions.initUnit({
        player,
        territory,
        game,
        god
      });
      result = firstTurnActions.initUnit({
        player,
        territory: result.territory,
        game: result.game,
        god
      });
      result = firstTurnActions.initUnit({
        player,
        territory: territory2,
        game: result.game,
        god
      });
      // then
      const resultTerritory1 = result.game.getEntity(territory);
      const resultTerritory2 = result.game.getEntity(territory2);

      expect(resultTerritory1.getOwner()).to.equal(player.id);
      expect(resultTerritory2.getOwner()).to.equal(player.id);
      expect(resultTerritory1.units.length).to.equal(2);
      expect(resultTerritory2.units.length).to.equal(1);
    });
    it("should throw an exception if trying to place 3 legionnaires with Junon", () => {
      const god = God.Junon;
      const territory = DataTest.territory.copy();
      const territory2 = territory.copy({ id: "territory2" });
      territory.nextTo(territory2);

      const game = new Game({ territories: [territory, territory2] });

      // when
      let result;
      result = firstTurnActions.initUnit({
        player,
        territory,
        game,
        god
      });
      result = firstTurnActions.initUnit({
        player,
        territory: territory2,
        game: result.game,
        god
      });
      expect(() => {
        result = firstTurnActions.initUnit({
          player,
          territory: result.territory,
          game: result.game,
          god
        });
      }).to.throw(
        "Il est impossible de placer une unité sur ce territoire : vous ne pouvez pas ajouter d'autres unités de type Légionnaire."
      );
    });
    it("should throw an exception if trying to place 2 legionnaires on the same territory with Junon", () => {
      const god = God.Junon;
      const territory = DataTest.territory.copy();

      const game = new Game({ territories: [territory] });

      // when
      let result;
      result = firstTurnActions.initUnit({
        player,
        territory,
        game,
        god
      });
      expect(() => {
        result = firstTurnActions.initUnit({
          player,
          territory: result.territory,
          game: result.game,
          god
        });
      }).to.throw(
        "Il est impossible de placer une unité sur ce territoire : vous devez prendre 2 territoires terrestres."
      );
    });
    it("should throw an exception if trying to place a boat far from a controlled earth territory", () => {
      const territory = DataTest.territory.copy();
      const territory2 = territory.copy({
        id: "territory2",
        type: TerritoryType.sea
      });
      const game = new Game({ territories: [territory, territory2] });

      // when
      let result;
      result = firstTurnActions.initUnit({
        player,
        territory,
        game,
        god
      });
      expect(() => {
        result = firstTurnActions.initUnit({
          player,
          territory: territory2,
          game: result.game,
          god
        });
      }).to.throw(
        "Il est impossible de placer une unité sur ce territoire : vous devez placer vos bateaux sur des territoires adjacents à vos territoires terrestres"
      );
    });
  });
});
