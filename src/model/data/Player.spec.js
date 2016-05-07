var expect = require("../../alias/Expect");
var Player = require("./Player");
var God = require("./God");
var GodCard = require("./GodCard");
var UnitType = require("./UnitType");
var Unit = require("./Unit");
var Territory = require("./Territory");
var Building = require("./Building");

describe('Player class', function () {
  var player;
  var player2;
  var territory;
  var territory2;
  var emptyTerritory;
  var playerLegionnaire;
  var player2Legionnaire;
  var playerGladiator;

  var getNewTerritory = function() {
    var newTerritory = new Territory({buildSlots: 4, type:"earth"});
    newTerritory.nextTo(territory);
    return newTerritory;
  }

  beforeEach(function () {
    player = new Player({name: "player", gold: 7});
    player2 = new Player({name: "player2", gold: 7});
    player.god = God.Minerve;
    playerLegionnaire = new Unit({type: UnitType.Legionnaire, owner: player});
    player2Legionnaire = new Unit({type: UnitType.Legionnaire, owner: player2});
    playerGladiator = new Unit({type: UnitType.Gladiator, owner: player});
    territory = new Territory({owner: player, buildSlots: 4, type:"earth"});
    territory2 = new Territory({owner: player, buildSlots: 4, type:"earth"});
    emptyTerritory = new Territory({buildSlots: 4, type:"earth"});
    emptyTerritory.nextTo(territory);
    God.allArray().map(function(god) {
      god.bid = null;
    })
  });

  describe("build method", function() {
    it('should build a building', function() {
      // when
      player.build(territory);
      // then
      expect(territory.buildSlots).to.equal(3);
      expect(territory.buildings).to.deep.equal([Building.Fort]);
    });
    it("should throw an exception if no god is currently associated with the player", function() {
      // given
      player.god = null;
      // then
      expect(function() {player.build(territory)}).to.throw("Il est impossible de construire : vous n'avez sélectionné aucun dieu.");
    });
    it("should throw an exception if Ceres god is currently associated with the player", function() {
      // given
      player.god = God.Ceres;
      // then
      expect(function() {player.build(territory)}).to.throw("Il est impossible de construire : ce dieu ne peut pas construire ce tour-ci.");
    });
    it("should throw an exception if there is no slot left on the territory", function() {
      territory.buildSlots = 0;
      // then
      expect(function() {player.build(territory)}).to.throw("Il est impossible de construire : il n'y a aucun emplacement libre sur le territoire sélectionné.");
    });
    it("should throw an exception if there is not enough gold", function() {
      player.gold = 1;
      // then
      expect(function() {player.build(territory)}).to.throw("Il est impossible de construire : vous n'avez pas assez de sesterces. Cette action coûte 2 sesterce(s).");
    });
  });

  describe("buyUnit method", function() {
    it("should buy a unit and place it on the territory (Minerve)", function() {
      // given
      player.god = God.Minerve;
      // when
      player.buyUnit(territory);
      // then
      expect(territory.units.length).to.equal(1);
    });
    it("should buy a unit and place it on the territory (Neptune)", function() {
      // given
      player.god = God.Neptune;
      territory.type = "sea";
      // when
      player.buyUnit(territory);
      // then
      expect(territory.units.length).to.equal(1);
    });
    it("should throw an exception if the territory cannot accept this unit type", function() {
      // given
      player.god = God.Neptune;
      territory.type = "earth";
      // then
      expect(function() {player.buyUnit(territory);}).to.throw("Il est impossible d'acheter une unité : il est impossible de placer ce type d'unité sur ce type de territoire.");
      expect(player.unitBuyCount).to.equal(0);
    });
    it("should throw an exception the player does not have enough gold", function() {
      // given
      player.god = God.Minerve;
      player.gold = 5;
      // then
      player.buyUnit(territory);
      player.buyUnit(territory);
      player.buyUnit(territory);
      expect(function() {player.buyUnit(territory);}).to.throw("Il est impossible d'acheter une unité : vous n'avez pas assez de sesterces. Cette action coûte 4 sesterce(s).");
    });
    it("should throw an exception if the god cannot give units", function() {
      // given
      player.god = God.Junon;
      // then
      expect(function() {player.buyUnit(territory);}).to.throw("Il est impossible d'acheter une unité : ce dieu ne peut pas vous fournir d'unité.");
    });
    it("should throw an exception if there is no more unit to buy", function() {
      // given
      player.god = God.Minerve;
      player.gold = 20;
      // then
      player.buyUnit(territory);
      player.buyUnit(territory);
      player.buyUnit(territory);
      player.buyUnit(territory);
      expect(function() {player.buyUnit(territory);}).to.throw("Il est impossible d'acheter une unité : il n'y a plus d'unité à acheter.");
    });
    it("should buy 2 gladiator units", function() {
      // given
      player.god = God.Pluton;
      player.god.index = 0;
      // then
      player.buyUnit(territory);
      player.buyUnit(territory);
    });
    it("should buy an gladiator unit and then throw an exception", function() {
      // given
      player.god = God.Pluton;
      player.god.index = 1;
      // then
      player.buyUnit(territory);
      expect(function() {player.buyUnit(territory);}).to.throw("Il est impossible d'acheter une unité : il n'y a plus d'unité à acheter.");
    });
    it("should throw an exception if the player does not own the territory", function() {
      // given
      player.god = God.Minerve;
      // when
      expect(function() {player.buyUnit(emptyTerritory);}).to.throw("Il est impossible d'acheter une unité : vous ne pouvez acheter des unités que sur des territoires que vous contrôlez");
    })
  });

  describe("buyCard method", function() {
    it("should buy a card", function() {
      // given
      player.god = God.Jupiter;
      // when
      var card = player.buyGodCard();
      // then
      expect(player.cards[card.name]).to.equal(1);
    });
    it("should throw an exception the player does not have enough gold", function() {
      // given
      player.god = God.Jupiter;
      player.gold = 1;
      // then
      player.buyGodCard();
      expect(function() {player.buyGodCard();}).to.throw("Il est impossible d'acheter une carte : vous n'avez pas assez de sesterces. Cette action coûte 4 sesterce(s).");
    });
    it("should throw an exception if the god cannot give cards", function() {
      // given
      player.god = God.Minerve;
      // then
      expect(function() {player.buyGodCard();}).to.throw("Il est impossible d'acheter une carte : ce dieu ne peut pas vous fournir de carte.");
    });
    it("should throw an exception if there is no more card to buy", function() {
      // given
      player.god = God.Junon;
      player.gold = 20;
      // then
      player.buyGodCard();
      player.buyGodCard();
      expect(function() {player.buyGodCard();}).to.throw("Il est impossible d'acheter une carte : il n'y a plus de carte à acheter.");
    });
  });

  describe("placeBid method", function() {
    it("should place a bid", function() {
      // given
      expect(player.bid).to.equal(undefined);
      player.gold = 8;
      // when
      player.placeBid(God.Minerve, 3);
      // then
      expect(!!player.bid).to.equal(true);
    });
    it("should place a bid with priests", function() {
      // given
      expect(player.bid).to.equal(undefined);
      player.addGodCard(GodCard.Priest);
      player.addGodCard(GodCard.Priest);
      player.addGodCard(GodCard.Priest);
      player.gold = 3;
      // when
      player.placeBid(God.Minerve, 6);
      // then
      expect(!!player.bid).to.equal(true);
    });
    it("should throw an exception because not enough gold", function() {
      // given
      player.gold = 3;
      // then
      expect(function() {player.placeBid(God.Minerve, 4);}).to.throw("Il est impossible de placer cette enchère : vous n'avez pas assez de sesterces.");
    });
    it("should throw an exception because bidding twice on the same god", function() {
      // given
      player.gold = 3;
      // then
      player.placeBid(God.Minerve, 2);
      expect(function() {player.placeBid(God.Minerve, 3);}).to.throw("Il est impossible de placer cette enchère : il est mpossible de surenchérir sur le même dieu.");
    });
  });

  describe("payBid method", function() {
    it("should pay bid", function() {
      // given
      player.gold = 4;
      player.placeBid(God.Minerve, 3);
      // when
      player.payBid();
      // then
      expect(player.gold).to.equal(1);
    });
    it("should pay 1 gold", function() {
      // given
      player.gold = 2;
      player.addGodCard(GodCard.Priest);
      player.addGodCard(GodCard.Priest);
      player.placeBid(God.Minerve, 2);
      // when
      player.payBid();
      // then
      expect(player.gold).to.equal(1);
    });
  });

  describe("move method", function() {
    it("should take control of dest empty territory (Minerve)", function() {
      // given
      player.gold = 1;
      player.god = God.Minerve;
      territory.placeUnit(playerLegionnaire);
      // when
      var units = [playerLegionnaire];
      player.move(units, territory, emptyTerritory);
      // then
      expect(territory.units.length).to.equal(0);
      expect(emptyTerritory.units.length).to.equal(1);
      expect(emptyTerritory.owner).to.equal(player);
      expect(player.gold).to.equal(0);
    });
    it("should take control of dest empty territory (Minerve) (more units)", function() {
      // given
      player.gold = 1;
      player.god = God.Minerve;
      territory.placeUnit(playerLegionnaire);
      territory.placeUnit(playerLegionnaire);
      territory.placeUnit(playerLegionnaire);
      // when
      var units = [playerLegionnaire, playerLegionnaire];
      player.move(units, territory, emptyTerritory);
      // then
      expect(territory.units.length).to.equal(1);
      expect(emptyTerritory.units.length).to.equal(2);
      expect(emptyTerritory.owner).to.equal(player);
      expect(player.gold).to.equal(0);
    });
    it("should throw an exception because there is not enough gold", function() {
      // given
      player.gold = 0;
      player.god = God.Minerve;
      territory.placeUnit(playerLegionnaire);
      // when
      var units = [playerLegionnaire];
      // then
      expect(territory.units.length).to.equal(1);
      expect(emptyTerritory.units.length).to.equal(0);
      expect(function() {player.move(units, territory, emptyTerritory);}).to.throw("Il est impossible de déplacer des unités : vous n'avez pas assez de sesterces. Cette action coûte 1 sesterce(s).");
      expect(player.gold).to.equal(0);
    });
    it("should take control of dest empty territory (gladiator legionnaires)", function() {
      // given
      player.gold = 1;
      player.god = God.Junon;
      territory.placeUnit(playerGladiator);
      territory.placeUnit(playerLegionnaire);
      // when
      var units = [playerLegionnaire, playerGladiator];
      player.move(units, territory, emptyTerritory);
      // then
      expect(territory.units.length).to.equal(0);
      expect(emptyTerritory.units.length).to.equal(2);
      expect(emptyTerritory.owner).to.equal(player);
      expect(player.gold).to.equal(0);
    });
    it("should throw an exception because destination is not next to source", function() {
      // given
      player.gold = 1;
      player.god = God.Minerve;
      territory.placeUnit(playerLegionnaire);
      // when
      var units = [playerLegionnaire];
      expect(function() {player.move(units, territory, territory2);}).to.throw("Il est impossible de déplacer des unités : le territoire de destination n'est pas adjacent au territoire de départ.");
    });
    it("should throw an exception because move is not allowed by the god", function() {
      // given
      player.gold = 1;
      player.god = God.Neptune;
      territory.placeUnit(playerLegionnaire);
      // when
      var units = [playerLegionnaire];
      expect(function() {player.move(units, territory, emptyTerritory);}).to.throw("Il est impossible de déplacer des unités : vous n'avez pas les faveurs du dieu correspondant.");
    });
  });

  describe("retreat method", function() {
    it("should retreat to an adjacent territory", function() {
      // given
      territory.placeUnit(playerLegionnaire);
      // when
      player.retreat(territory, emptyTerritory);
      // then
      expect(territory.units.length).to.equal(0);
      expect(emptyTerritory.units.length).to.equal(1);
    })
  });

  describe("move method : fights", function() {
    it("should remove units for both players", function(done) {
      // given
      player.gold = 1;
      player.god = God.Minerve;
      territory.placeUnit(playerLegionnaire);
      territory.placeUnit(playerLegionnaire);
      emptyTerritory.placeUnit(player2Legionnaire);
      emptyTerritory.placeUnit(player2Legionnaire);
      emptyTerritory.owner = player2;
      // when
      var units = [playerLegionnaire, playerLegionnaire];
      var result = player.move(units, territory, emptyTerritory);
      // then
      result.then(function(battle) {
        expect(battle.getDices()).to.deep.equal([0, 0]);
        expect(battle.getLoosers()).to.deep.equal([player2, player]);
        done();
      }).catch(done);
    });
    it("should remove 1 unit for player1", function(done) {
      // given
      player.gold = 1;
      player.god = God.Minerve;
      territory.placeUnit(playerLegionnaire);
      territory.placeUnit(playerLegionnaire);
      emptyTerritory.placeUnit(player2Legionnaire);
      emptyTerritory.placeUnit(player2Legionnaire);
      emptyTerritory.placeUnit(player2Legionnaire);
      emptyTerritory.owner = player2;
      // when
      var units = [playerLegionnaire, playerLegionnaire];
      var result = player.move(units, territory, emptyTerritory);
      // then
      result.then(function(battle) {
        expect(battle.getLoosers()).to.deep.equal([player]);
        done();
      }).catch(done);
    });
    it("should not remove units and wait for player1 choice and remove 1 unit for player2", function(done) {
      // given
      player.gold = 1;
      player.god = God.Minerve;
      territory.placeUnit(playerLegionnaire);
      territory.placeUnit(playerGladiator);
      emptyTerritory.placeUnit(player2Legionnaire);
      emptyTerritory.placeUnit(player2Legionnaire);
      emptyTerritory.owner = player2;
      // when
      var units = [playerLegionnaire, playerGladiator];
      var result = player.move(units, territory, emptyTerritory);
      // then
      result.then(function(battleResult) {
        expect(battleResult.getLoosers()).to.deep.equal([player2, player]);
        done();
      }).catch(done);
    });
  });

  describe("initBuilding method", function() {
    it("should place the building according to the chosen god", function() {
      // given
      player.god = God.Minerve;
      territory.owner = player;
      // when
      player.initBuilding(territory, Building.Fort);
      // then
      expect(territory.buildings.indexOf(Building.Fort)).to.equal(0);
    });
    it("should throw an exception if the building cannot be built by the chosen god", function() {
      // given
      player.god = God.Minerve;
      territory.owner = player;
      // then
      expect(function() {player.initBuilding(territory, Building.Port);}).to.throw("Il est impossible de placer ce bâtiment : le dieu choisi ne peut pas construire ce bâtiment.");
    });
    it("should throw an exception if the building cannot be built by the chosen god (Pluton)", function() {
      // given
      player.god = God.Pluton;
      territory.owner = player;
      // when
      player.initBuilding(territory, Building.Port);
      // then
      expect(territory.buildings.length).to.equal(1);
    });
    it("should throw an exception if the territory is not controlled", function() {
      // given
      player.god = God.Minerve;
      // when
      expect(function() {player.initBuilding(emptyTerritory, Building.Fort);}).to.throw("Il est impossible de placer ce bâtiment : vous devez contrôller le territoire pour y placer un bâtiment.");
    });
  });
});
