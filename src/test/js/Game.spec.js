'use strict';

describe("Game class", function() {
  var game;
  var player;
  var player2;
  var newTerritory = function() {
    var territory = new Territory({type: "earth"});
    game.territories.push(territory);
    return territory;
  }
  var fakePromise = function(value) {
    return {
      then: function(fonction) {
        var newValue = fonction(value);
        return fakePromise(newValue);
      }
    }
  }

  var fakeRandomFactory = function(qPlus) {
    var result = randomFactory();
    result.generate = function(size) {
      var randoms = Array.seq(0, size).map(function() {
        return Math.random();
      });
      return fakePromise(randoms);
    }
    return result;
  }

  beforeEach(function() {
    player = new Player();
    player2 = new Player();
    game = new Game({
      players: [player, player2],
      randomFactory: fakeRandomFactory(),
      turn: 1
    });
  });

  describe("receiveCommand method", function() {
    it("should receive a build command", function() {
      var calledArg;
      player.build = function(arg) {
        calledArg = arg;
      }
      game.receiveCommand(new Command({
        type: CommandType.Build,
        player: player,
        args: ["test"]
      }));
      expect(calledArg).toBe("test");
    });
  });

  describe("initUnit method", function() {
    it("should place a unit on 2 empty territories", function() {
      // given
      player.god = God.Junon;
      var territory = newTerritory();
      var territory2 = newTerritory();
      territory.nextTo(territory2);
      // when
      game.initUnit(player, territory);
      game.initUnit(player, territory2);
      // then
      expect(territory.owner).toBe(player);
      expect(territory.units.length).toBe(1);
      expect(territory.units[0].type).toBe(UnitType.Legionnaire);
      expect(territory2.owner).toBe(player);
    });
    it("should throw an exception if the territory is already controlled by another player", function() {
      //given
      player.god = God.Minerve;
      player2.god = God.Junon;
      var territory = newTerritory();
      game.initUnit(player2, territory);
      // then
      expect(function() {game.initUnit(player, territory)}).toThrow(new Error("Il est impossible de placer une unité sur ce territoire : vous devez contrôler le territoire ou le territoire doit être neutre."));
    });
    it("should throw an exception if trying to place unit on a 3rd territory", function() {
      // given
      player.god = God.Junon;
      var territory1 = newTerritory();
      var territory2 = newTerritory();
      var territory3 = newTerritory();
      territory1.nextTo(territory2);
      territory1.nextTo(territory3);

      game.initUnit(player, territory1);
      game.initUnit(player, territory2);
      // then
      expect(function() {game.initUnit(player, territory3);}).toThrow(new Error("Il est impossible de placer une unité sur ce territoire : vous devez prendre 2 territoires terrestres et 2 territoires maritimes contigus."));
    });
    it("should throw an exception if trying to place unit on non-adjacent territories", function() {
      // given
      player.god = God.Junon;
      game.initUnit(player, newTerritory());
      // then
      expect(function() {game.initUnit(player, newTerritory());}).toThrow(new Error("Il est impossible de placer une unité sur ce territoire : il n'est pas adjacent aux territoires déjà contrôlés."));
    });
    it("should place 3 legionnaires with Minerve", function() {
      // given
      player.god = God.Minerve;
      var territory1 = newTerritory();
      var territory2 = newTerritory();
      territory1.nextTo(territory2);
      // when
      game.initUnit(player, territory1);
      game.initUnit(player, territory1);
      game.initUnit(player, territory2);
      // then
      expect(territory1.owner).toBe(player);
      expect(territory2.owner).toBe(player);
      expect(territory1.units.length).toBe(2);
      expect(territory2.units.length).toBe(1);
    })
    it("should throw an exception if trying to place 3 legionnaires with Junon", function() {
      // given
      player.god = God.Junon;
      var territory1 = newTerritory();
      var territory2 = newTerritory();
      territory1.nextTo(territory2);
      // when
      game.initUnit(player, territory1);
      game.initUnit(player, territory2);
      // then
      expect(function() {game.initUnit(player, territory1);}).toThrow(new Error("Il est impossible de placer une unité sur ce territoire : vous ne pouvez pas ajouter d'autres unités de type legionnaire."));
    });
    it("should throw an exception if trying to place 2 legionnaires on the same territory with Junon", function() {
      // given
      player.god = God.Junon;
      var territory1 = newTerritory();
      // when
      game.initUnit(player, territory1);
      // then
      expect(function() {game.initUnit(player, territory1);}).toThrow(new Error("Il est impossible de placer une unité sur ce territoire : vous devez prendre 2 territoires terrestres et 2 territoires maritimes contigus."));
    });
  });

  describe("getTemples method", function() {
    it("should return the number of temples for a given player", function() {
      // given
      var territory = newTerritory();
      territory.buildings.push(Building.Temple);
      territory.buildings.push(Building.Temple);

      var territory2 = newTerritory();
      territory2.buildings.push(Building.Cite);

      territory.owner = player;
      territory2.owner = player;
      // then
      expect(game.getTemples(player)).toBe(3);
    });
  });

  describe("buyCreature method", function() {
    it("should buy the creatures for player. Temples should be used only once", function() {
      // given
      player = player.withAtt("gold", 7);

      var territory = newTerritory();
      territory.buildings.push(Building.Temple);
      territory.owner = player;

      var creature = CreatureCard._all.Sphinx;
      var creature2 = CreatureCard._all.Méduse;

      game.creatures = [creature, creature2, null];
      // when
      game.buyCreature(player, creature, []);
      // then
      expect(player.gold).toBe(7 - 3);

      // when
      game.buyCreature(player, creature2, [territory]);
      // then
      expect(player.gold).toBe(7 - 3 - 3);
    });
  });

  describe("pushCreatures method", function() {
    var creature = CreatureCard._all.Sphinx;

    it("should push the creatures [X, X, 0]", function() {
      game.creatures = [creature, creature, null];
      game.pushCreatures().then(function() {
        expect(game.creatures.length).toBe(3);
        expect(game.creatures[0]).toBeDefined();
        expect(game.creatures[1]).toBe(creature);
        expect(game.creatures[2]).toBe(creature);
      });
    });

    it("should push the creatures [X, 0, X]", function() {
      game.creatures = [creature, null, creature];
      game.pushCreatures().then(function() {
        expect(game.creatures.length).toBe(3);
        expect(game.creatures[0]).toBeDefined();
        expect(game.creatures[1]).toBeDefined();
        expect(game.creatures[2]).toBe(creature);
      });
    });

    it("should push the creatures [0, X, X]", function() {
      game.creatures = [null, creature, creature];
      game.pushCreatures().then(function() {
        expect(game.creatures.length).toBe(3);
        expect(game.creatures[0]).toBeDefined();
        expect(game.creatures[1]).toBeDefined();
        expect(game.creatures[2]).toBe(creature);
      });
    });

    it("should push the creatures [0, 0, X]", function() {
      game.creatures = [null, null, creature];
      game.pushCreatures().then(function() {
        expect(game.creatures.length).toBe(3);
        expect(game.creatures[0]).toBeDefined();
        expect(game.creatures[1]).toBeDefined();
        expect(game.creatures[2]).toBeDefined();
      });
    });

    it("should push the creatures [0, X, 0]", function() {
      game.creatures = [null, creature, null];
      game.pushCreatures().then(function() {
        expect(game.creatures.length).toBe(3);
        expect(game.creatures[0]).toBeDefined();
        expect(game.creatures[1]).toBeDefined();
        expect(game.creatures[2]).toBe(creature);
      });
    });

    it("should push the creatures [X, 0, 0]", function() {
      game.creatures = [creature, null, null];
      game.pushCreatures().then(function() {
        expect(game.creatures.length).toBe(3);
        expect(game.creatures[0]).toBeDefined();
        expect(game.creatures[1]).toBeDefined();
        expect(game.creatures[2]).toBe(creature);
      });
    });

    it("should push the creatures [0, 0, 0]", function() {
      game.creatures = [null, null, null];
      game.pushCreatures().then(function() {
        expect(game.creatures.length).toBe(3);
        expect(game.creatures[0]).toBeDefined();
        expect(game.creatures[1]).toBeDefined();
        expect(game.creatures[2]).toBeDefined();
      });
    });
  });
})
