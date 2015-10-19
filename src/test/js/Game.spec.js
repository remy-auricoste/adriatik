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
  beforeEach(function() {
    player = new Player();
    player2 = new Player();
    game = new Game({
      players: [player, player2],
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
      player.god = God.Minerve;
      var territory = newTerritory();
      var territory2 = newTerritory();
      territory.nextTo(territory2);
      // when
      game.initUnit(player, territory);
      game.initUnit(player, territory2);
      // then
      expect(territory.owner).toBe(player);
      expect(territory.units.length).toBe(1);
      expect(territory.units[0].type).toBe(UnitType.Troup);
      expect(territory2.owner).toBe(player);
    });
    it("should throw an exception if the territory is already controlled by another player", function() {
      //given
      player.god = God.Mars;
      player2.god = God.Minerve;
      var territory = newTerritory();
      game.initUnit(player2, territory);
      // then
      expect(function() {game.initUnit(player, territory)}).toThrow(new Error("Impossible de placer une unité sur ce territoire : vous devez contrôler le territoire ou le territoire doit être neutre"));
    });
    it("should throw an exception if trying to place unit on a 3rd territory", function() {
      // given
      player.god = God.Minerve;
      var territory1 = newTerritory();
      var territory2 = newTerritory();
      var territory3 = newTerritory();
      territory1.nextTo(territory2);
      territory1.nextTo(territory3);

      game.initUnit(player, territory1);
      game.initUnit(player, territory2);
      // then
      expect(function() {game.initUnit(player, territory3);}).toThrow(new Error("Impossible de placer une unité sur ce territoire : vous devez prendre 2 territoires terrestres et 2 territoires maritimes contigus"));
    });
    it("should throw an exception if trying to place unit on non-adjacent territories", function() {
      // given
      player.god = God.Minerve;
      game.initUnit(player, newTerritory());
      // then
      expect(function() {game.initUnit(player, newTerritory());}).toThrow(new Error("Impossible de placer une unité sur ce territoire : il n'est pas adjacent aux territoires déjà contrôllés"));
    });
    it("should place 3 troups with Mars", function() {
      // given
      player.god = God.Mars;
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
    it("should throw an exception if trying to place 3 troups with Minerve", function() {
      // given
      player.god = God.Minerve;
      var territory1 = newTerritory();
      var territory2 = newTerritory();
      territory1.nextTo(territory2);
      // when
      game.initUnit(player, territory1);
      game.initUnit(player, territory2);
      // then
      expect(function() {game.initUnit(player, territory1);}).toThrow(new Error("Impossible de placer une unité sur ce territoire : vous ne pouvez pas ajouter d'autres unités de type troup"));
    });
    it("should throw an exception if trying to place 2 troups on the same territory with Minerve", function() {
      // given
      player.god = God.Minerve;
      var territory1 = newTerritory();
      // when
      game.initUnit(player, territory1);
      // then
      expect(function() {game.initUnit(player, territory1);}).toThrow(new Error("Impossible de placer une unité sur ce territoire : vous devez prendre 2 territoires terrestres et 2 territoires maritimes contigus"));
    });
  });
})
