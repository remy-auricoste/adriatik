'use strict';

describe('Player class', function () {
  var player;
  var territory;
  var territory2;
  var emptyTerritory;
  var playerTroup;
  var playerElite;

  beforeEach(function () {
    player = Player.new();
    player.god = God.Mars;
    playerTroup = new Unit({type: UnitType.Troup, owner: player});
    playerElite = new Unit({type: UnitType.Elite, owner: player});
    territory = new Territory({owner: player, buildSlots: 4, type:"earth"});
    territory2 = new Territory({owner: player, buildSlots: 4, type:"earth"});
    emptyTerritory = new Territory({buildSlots: 4, type:"earth"});
    emptyTerritory.nextTo(territory);
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

  describe("placeBid method", function() {
    it("should place a bid", function() {
      // given
      expect(player.bid).toBe(undefined);
      player.gold = 8;
      // when
      player.placeBid(God.Mars, 3);
      // then
      expect(player.bid).toBeDefined();
    });
    it("should place a bid with priests", function() {
      // given
      expect(player.bid).toBe(undefined);
      player.addGodCard(GodCard.Priest);
      player.addGodCard(GodCard.Priest);
      player.addGodCard(GodCard.Priest);
      player.gold = 3;
      // when
      player.placeBid(God.Mars, 6);
      // then
      expect(player.bid).toBeDefined();
    });
    it("should throw an exception because not enough gold", function() {
      // given
      player.gold = 3;
      // then
      expect(function() {player.placeBid(God.Mars, 4);}).toThrow(new Error("Impossible de placer cette enchère : pas assez d'or"));
    });
  });

  describe("payBid method", function() {
    it("should pay bid", function() {
      // given
      player.gold = 4;
      player.placeBid(God.Mars, 3);
      // when
      player.payBid();
      // then
      expect(player.gold).toBe(1);
    });
    it("should pay 1 gold", function() {
      // given
      player.gold = 2;
      player.addGodCard(GodCard.Priest);
      player.addGodCard(GodCard.Priest);
      player.placeBid(God.Mars, 2);
      // when
      player.payBid();
      // then
      expect(player.gold).toBe(1);
    });
  });

  describe("move method", function() {
    it("should take control of dest empty territory (Mars)", function() {
      // given
      player.gold = 1;
      player.god = God.Mars;
      territory.placeUnit(playerTroup);
      // when
      var units = [playerTroup];
      player.move(units, territory, emptyTerritory);
      // then
      expect(territory.units.length).toBe(0);
      expect(emptyTerritory.units.length).toBe(1);
      expect(emptyTerritory.owner).toBe(player);
      expect(player.gold).toBe(0);
    });
    it("should take control of dest empty territory (Mars) (more units)", function() {
      // given
      player.gold = 1;
      player.god = God.Mars;
      territory.placeUnit(playerTroup);
      territory.placeUnit(playerTroup);
      territory.placeUnit(playerTroup);
      // when
      var units = [playerTroup, playerTroup];
      player.move(units, territory, emptyTerritory);
      // then
      expect(territory.units.length).toBe(1);
      expect(emptyTerritory.units.length).toBe(2);
      expect(emptyTerritory.owner).toBe(player);
      expect(player.gold).toBe(0);
    });
    it("should throw an exception because there is not enough gold", function() {
      // given
      player.gold = 0;
      player.god = God.Mars;
      territory.placeUnit(playerTroup);
      // when
      var units = [playerTroup];
      // then
      expect(territory.units.length).toBe(1);
      expect(emptyTerritory.units.length).toBe(0);
      expect(function() {player.move(units, territory, emptyTerritory);}).toThrow(new Error("Impossible de déplacer des unités : pas assez de pièces. Cette action coûte 1 pièces"));
      expect(player.gold).toBe(0);
    });
    it("should take control of dest empty territory (elite troups)", function() {
      // given
      player.gold = 1;
      player.god = God.Minerve;
      territory.placeUnit(playerElite);
      territory.placeUnit(playerTroup);
      // when
      var units = [playerTroup, playerElite];
      player.move(units, territory, emptyTerritory);
      // then
      expect(territory.units.length).toBe(0);
      expect(emptyTerritory.units.length).toBe(2);
      expect(emptyTerritory.owner).toBe(player);
      expect(player.gold).toBe(0);
    });
    it("should throw an exception because destination is not next to source", function() {
      // given
      player.gold = 1;
      player.god = God.Mars;
      territory.placeUnit(playerTroup);
      // when
      var units = [playerTroup];
      expect(function() {player.move(units, territory, territory2);}).toThrow(new Error("Impossible de déplacer des unités : le territoire de destination n'est pas adjacent au territoire de départ"));
    });
    it("should throw an exception because move is not allowed by the god", function() {
      // given
      player.gold = 1;
      player.god = God.Neptune;
      territory.placeUnit(playerTroup);
      // when
      var units = [playerTroup];
      expect(function() {player.move(units, territory, emptyTerritory);}).toThrow(new Error("Impossible de déplacer des unités : vous n'avez pas les faveurs du dieu correspondant"));
    });
  });

  describe("retreat method", function() {
    it("should retreat to an adjacent territory", function() {
      // given
      territory.placeUnit(playerTroup);
      // when
      player.retreat(territory, emptyTerritory);
      // then
      expect(territory.units.length).toBe(0);
      expect(emptyTerritory.units.length).toBe(1);
    })
  });
});
