'use strict';

describe('Player class', function () {
  var player;
  var territory;

  beforeEach(function () {
    player = Player.new();
    player.god = God.Mars;
    territory = new Territory({owner: player, buildSlots: 4, type:"earth"});
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
      expect(function() {player.build(territory)}).toThrow(new Error("Impossible de construire : pas assez de pièces. Cette action coûte 2 pièces"));
    });
  });

  describe("buyUnit method", function() {
    it("should buy a unit and place it on the territory (Mars)", function() {
      // given
      player.god = God.Mars;
      // when
      player.buyUnit(territory);
      // then
      expect(territory.units.length).toBe(1);
    });
    it("should buy a unit and place it on the territory (Neptune)", function() {
      // given
      player.god = God.Neptune;
      territory.type = "sea";
      // when
      player.buyUnit(territory);
      // then
      expect(territory.units.length).toBe(1);
    });
    it("should throw an exception if the territory cannot accept this unit type", function() {
      // given
      player.god = God.Neptune;
      territory.type = "earth";
      // then
      expect(function() {player.buyUnit(territory);}).toThrow(new Error("Impossible d'acheter une unité : impossible de placer ce type d'unité sur ce type de territoire"));
      expect(player.unitBuyCount).toBe(0);
    });
    it("should throw an exception the player does not have enough gold", function() {
      // given
      player.god = God.Mars;
      player.gold = 5;
      // then
      player.buyUnit(territory);
      player.buyUnit(territory);
      player.buyUnit(territory);
      expect(function() {player.buyUnit(territory);}).toThrow(new Error("Impossible d'acheter une unité : pas assez de pièces. Cette action coûte 4 pièces"));
    });
    it("should throw an exception if the god cannot give units", function() {
      // given
      player.god = God.Minerve;
      // then
      expect(function() {player.buyUnit(territory);}).toThrow(new Error("Impossible d'acheter une unité : ce dieu ne peut pas vous fournir d'unité"));
    });
    it("should throw an exception if there is no more unit to buy", function() {
      // given
      player.god = God.Mars;
      player.gold = 20;
      // then
      player.buyUnit(territory);
      player.buyUnit(territory);
      player.buyUnit(territory);
      player.buyUnit(territory);
      expect(function() {player.buyUnit(territory);}).toThrow(new Error("Impossible d'acheter une unité : il n'y a plus d'unité à acheter"));
    });
    it("should buy 2 elite units", function() {
      // given
      player.god = God.Pluton;
      player.god.index = 0;
      // then
      player.buyUnit(territory);
      player.buyUnit(territory);
    });
    it("should buy an elite unit and then throw an exception", function() {
      // given
      player.god = God.Pluton;
      player.god.index = 1;
      // then
      player.buyUnit(territory);
      expect(function() {player.buyUnit(territory);}).toThrow(new Error("Impossible d'acheter une unité : il n'y a plus d'unité à acheter"));
    });
  });

  describe("buyCard method", function() {
    it("should buy a card", function() {
      // given
      player.god = God.Jupiter;
      // when
      var card = player.buyGodCard();
      // then
      expect(player.cards[card.name]).toBe(1);
    });
    it("should throw an exception the player does not have enough gold", function() {
      // given
      player.god = God.Jupiter;
      player.gold = 1;
      // then
      player.buyGodCard();
      expect(function() {player.buyGodCard();}).toThrow(new Error("Impossible d'acheter une carte : pas assez de pièces. Cette action coûte 4 pièces"));
    });
    it("should throw an exception if the god cannot give cards", function() {
      // given
      player.god = God.Mars;
      // then
      expect(function() {player.buyGodCard();}).toThrow(new Error("Impossible d'acheter une carte : ce dieu ne peut pas vous fournir de carte"));
    });
    it("should throw an exception if there is no more card to buy", function() {
      // given
      player.god = God.Minerve;
      player.gold = 20;
      // then
      player.buyGodCard();
      player.buyGodCard();
      expect(function() {player.buyGodCard();}).toThrow(new Error("Impossible d'acheter une carte : il n'y a plus de carte à acheter"));
    });
  });
});
