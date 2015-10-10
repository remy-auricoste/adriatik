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
      expect(function() {player.build(territory)}).toThrow(new Error("Impossible de construire : aucun dieu n'est sélectionné"));
    });
    it("should throw an exception if Apollon god is currently associated with the player", function() {
      // given
      player.god = God.Apollon;
      // then
      expect(function() {player.build(territory)}).toThrow(new Error("Impossible de construire : ce dieu ne peut pas construire ce tour-ci"));
    });
    it("should throw an exception if there is no slot left on the territory", function() {
      territory.buildSlots = 0;
      // then
      expect(function() {player.build(territory)}).toThrow(new Error("Impossible de construire : aucun emplacement libre sur le territoire sélectionné"));
    });
    it("should throw an exception if there is not enough gold", function() {
      player.gold = 1;
      // then
      expect(function() {player.build(territory)}).toThrow(new Error("Impossible de construire : pas assez d'or"));
    });
  });
});
