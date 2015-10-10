'use strict';

describe('Player class', function () {
  var player;
  var territory;

  beforeEach(function () {
    player = Player.new();
    player.god = God.Mars;
    territory = new Territory({owner: player, buildSlots: 4});
  });

  describe("build method", function() {
    it('should build a building', function() {
      // when
      player.build(territory);
      // then
      expect(territory.buildSlots).toBe(3);
      expect(territory.buildings).toEqual([Building.Fort]);
    });
    it("should throw an exception if no god is currently associated with the player", function() {
      // given
      player.god = null;
      // then
      expect(function() {player.build(territory)}).toThrow(new Error("cannot build : no god associated"));
    });
    it("should throw an exception if Apollon god is currently associated with the player", function() {
      // given
      player.god = God.Apollon;
      // then
      expect(function() {player.build(territory)}).toThrow(new Error("cannot build : no building associated with the god"));
    });
    it("should throw an exception if there is no slot left on the territory", function() {
      territory.buildSlots = 0;
      // then
      expect(function() {player.build(territory)}).toThrow(new Error("cannot build : no slot left"));
    });
  });
});
