var injector = require("../../core/InjectorTest");
require("./Game");
require("./Player");

var Game = injector.getInstance("Game");
var Player = injector.getInstance("Player");

var CreatureCard = require("./CreatureCard");
var God = require("./God");
var GodCard = require("./GodCard");
var Territory = require("./Territory");
var Building = require("./Building");
var UnitType = require("./UnitType");

var randomFactory = require("../../services/randomFactory");

describe("Game class", function() {
  var game;
  var player;
  var player2;
  var newTerritory = function() {
    var territory = new Territory({ type: "earth", buildSlots: 4 });
    game.territories.push(territory);
    territory.index = game.territories.length - 1;
    return territory;
  };

  beforeEach(function() {
    player = new Player({ name: "player1" });
    player2 = new Player({ name: "player2" });
    game = new Game({
      players: [player, player2],
      turn: 1,
      warMode: true
    });
  });

  describe("initUnit method", function() {
    it("should place a unit on 2 empty territories", function() {
      // given
      game = game.addBid(player, God.Junon, 1);
      var territory = newTerritory();
      var territory2 = newTerritory();
      territory.nextTo(territory2);
      // when
      game = game.initUnit(player.name, territory.index);
      game = game.initUnit(player.name, territory2.index);
      // then
      territory = game.getTerritory(territory.index);
      territory2 = game.getTerritory(territory2.index);

      expect(territory.owner).to.equal(player.name);
      expect(territory.units.length).to.equal(1);
      expect(territory.units[0].type).to.equal(UnitType.Legionnaire);
      expect(territory2.owner).to.equal(player.name);
    });
    it("should throw an exception if the territory is already controlled by another player", function() {
      //given
      game = game.addBid(player, God.Minerve, 1);
      game = game.addBid(player2, God.Junon, 1);
      var territory = newTerritory();
      game = game.initUnit(player2.name, territory.index);
      // then
      expect(function() {
        game.initUnit(player.name, territory.index);
      }).to.throw(
        "Il est impossible de placer une unité sur ce territoire : vous devez contrôler le territoire ou le territoire doit être neutre."
      );
    });
    it("should throw an exception if trying to place unit on a 3rd territory", function() {
      // given
      game = game.addBid(player, God.Junon, 1);
      var territory1 = newTerritory();
      var territory2 = newTerritory();
      var territory3 = newTerritory();
      territory1.nextTo(territory2);
      territory1.nextTo(territory3);

      game = game.initUnit(player.name, territory1.index);
      game = game.initUnit(player.name, territory2.index);
      // then
      expect(function() {
        game.initUnit(player.name, territory3.index);
      }).to.throw(
        "Il est impossible de placer une unité sur ce territoire : vous devez prendre 2 territoires terrestres et 2 territoires maritimes contigus."
      );
    });
    it("should throw an exception if trying to place unit on non-adjacent territories", function() {
      // given
      game = game.addBid(player, God.Junon, 1);
      game = game.initUnit(player.name, newTerritory().index);
      // then
      expect(function() {
        game.initUnit(player.name, newTerritory().index);
      }).to.throw(
        "Il est impossible de placer une unité sur ce territoire : il n'est pas adjacent aux territoires déjà contrôlés."
      );
    });
    it("should place 3 legionnaires with Minerve", function() {
      // given
      game = game.addBid(player, God.Minerve, 1);
      var territory1 = newTerritory();
      var territory2 = newTerritory();
      territory1.nextTo(territory2);
      // when
      game = game.initUnit(player.name, territory1.index);
      game = game.initUnit(player.name, territory1.index);
      game = game.initUnit(player.name, territory2.index);
      // then
      territory1 = game.getTerritory(territory1.index);
      territory2 = game.getTerritory(territory2.index);

      expect(territory1.owner).to.equal(player.name);
      expect(territory2.owner).to.equal(player.name);
      expect(territory1.units.length).to.equal(2);
      expect(territory2.units.length).to.equal(1);
    });
    it("should throw an exception if trying to place 3 legionnaires with Junon", function() {
      // given
      game = game.addBid(player, God.Junon, 1);
      var territory1 = newTerritory();
      var territory2 = newTerritory();
      territory1.nextTo(territory2);
      // when
      game = game.initUnit(player.name, territory1.index);
      game = game.initUnit(player.name, territory2.index);
      // then
      expect(function() {
        game.initUnit(player.name, territory1.index);
      }).to.throw(
        "Il est impossible de placer une unité sur ce territoire : vous ne pouvez pas ajouter d'autres unités de type legionnaire."
      );
    });
    it("should throw an exception if trying to place 2 legionnaires on the same territory with Junon", function() {
      // given
      game = game.addBid(player, God.Junon, 1);
      var territory1 = newTerritory();
      // when
      game = game.initUnit(player.name, territory1.index);
      // then
      expect(function() {
        game.initUnit(player.name, territory1.index);
      }).to.throw(
        "Il est impossible de placer une unité sur ce territoire : vous devez prendre 2 territoires terrestres et 2 territoires maritimes contigus."
      );
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

      territory.owner = player.name;
      territory2.owner = player.name;
      // then
      expect(game.getTemples(player.name)).to.equal(3);
    });
  });

  describe("buyCreature method", function() {
    it("should buy the creatures for player. Temples should be used only once", function() {
      // given
      var territory = newTerritory();
      territory.buildings.push(Building.Temple);
      territory.owner = player.name;

      var creature = CreatureCard._all.Sphinx;
      var creature2 = CreatureCard._all.Méduse;

      game.creatures = [creature, creature2, null];
      // when
      game = game.buyCreature(player.name, creature, []);
      // then
      expect(game.getPlayerByName(player.name).gold).to.equal(7 - 3);

      // when
      game = game.buyCreature(player.name, creature2, [territory]);
      // then
      expect(game.getPlayerByName(player.name).gold).to.equal(7 - 3 - 3);
    });
  });

  describe("pushCreatures method", function() {
    var creature = CreatureCard._all.Sphinx;

    it("should push the creatures [X, X, 0]", function(done) {
      game.creatures = [creature, creature, null];
      game
        .pushCreatures()
        .then(function() {
          expect(game.creatures.length).to.equal(3);
          expect(!!game.creatures[0]).to.equal(true);
          expect(game.creatures[1]).to.equal(creature);
          expect(game.creatures[2]).to.equal(creature);
          done();
        })
        .catch(done);
    });

    it("should push the creatures [X, 0, X]", function(done) {
      game.creatures = [creature, null, creature];
      game
        .pushCreatures()
        .then(function() {
          expect(game.creatures.length).to.equal(3);
          expect(!!game.creatures[0]).to.equal(true);
          expect(!!game.creatures[1]).to.equal(true);
          expect(game.creatures[2]).to.equal(creature);
          done();
        })
        .catch(done);
    });

    it("should push the creatures [0, X, X]", function(done) {
      game.creatures = [null, creature, creature];
      game
        .pushCreatures()
        .then(function() {
          expect(game.creatures.length).to.equal(3);
          expect(!!game.creatures[0]).to.equal(true);
          expect(!!game.creatures[1]).to.equal(true);
          expect(game.creatures[2]).to.equal(creature);
          done();
        })
        .catch(done);
    });

    it("should push the creatures [0, 0, X]", function(done) {
      game.creatures = [null, null, creature];
      game
        .pushCreatures()
        .then(function() {
          expect(game.creatures.length).to.equal(3);
          expect(!!game.creatures[0]).to.equal(true);
          expect(!!game.creatures[1]).to.equal(true);
          expect(!!game.creatures[2]).to.equal(true);
          done();
        })
        .catch(done);
    });

    it("should push the creatures [0, X, 0]", function(done) {
      game.creatures = [null, creature, null];
      game
        .pushCreatures()
        .then(function() {
          expect(game.creatures.length).to.equal(3);
          expect(!!game.creatures[0]).to.equal(true);
          expect(!!game.creatures[1]).to.equal(true);
          expect(game.creatures[2]).to.equal(creature);
          done();
        })
        .catch(done);
    });

    it("should push the creatures [X, 0, 0]", function(done) {
      game.creatures = [creature, null, null];
      game
        .pushCreatures()
        .then(function() {
          expect(game.creatures.length).to.equal(3);
          expect(!!game.creatures[0]).to.equal(true);
          expect(!!game.creatures[1]).to.equal(true);
          expect(game.creatures[2]).to.equal(creature);
          done();
        })
        .catch(done);
    });

    it("should push the creatures [0, 0, 0]", function(done) {
      game.creatures = [null, null, null];
      game
        .pushCreatures()
        .then(function() {
          expect(game.creatures.length).to.equal(3);
          expect(!!game.creatures[0]).to.equal(true);
          expect(!!game.creatures[1]).to.equal(true);
          expect(!!game.creatures[2]).to.equal(true);
          done();
        })
        .catch(done);
    });
  });

  describe("build method", function() {
    it("should build a building", function() {
      // when
      var territory = newTerritory();
      game = game.addBid(player, God.Minerve, 1);
      game = game.build(player.name, territory.index, Building.Fort);
      // then
      territory = game.getTerritory(territory.index);
      expect(territory.buildSlots).to.equal(3);
      expect(territory.buildings).to.deep.equal([Building.Fort]);
    });
    it("should throw an exception if no god is currently associated with the player", function() {
      // given
      var territory = newTerritory();
      // then
      expect(function() {
        game.build(player.name, territory.index, Building.Fort);
      }).to.throw(
        "Il est impossible de construire : vous n'avez sélectionné aucun dieu."
      );
    });
    it("should throw an exception if Ceres god is currently associated with the player", function() {
      // given
      var territory = newTerritory();
      game = game.addBid(player, God.Ceres, 0);
      // then
      expect(function() {
        game.build(player.name, territory.index, Building.Fort);
      }).to.throw(
        "Il est impossible de construire : ce dieu ne peut pas construire ce tour-ci."
      );
    });
    it("should throw an exception if there is no slot left on the territory", function() {
      var territory = newTerritory().copy({ buildSlots: 0 });
      game = game.updateTerritory(territory);
      game = game.addBid(player, God.Minerve, 1);
      // then
      expect(function() {
        game.build(player.name, territory.index, Building.Fort);
      }).to.throw(
        "Il est impossible de construire : il n'y a aucun emplacement libre sur le territoire sélectionné."
      );
    });
    it("should throw an exception if there is not enough gold", function() {
      var territory = newTerritory();
      player = player.copy({ gold: 1 });
      game = game.updatePlayer(player);
      game = game.addBid(player, God.Minerve, 1);
      // then
      expect(function() {
        game.build(player.name, territory.index, Building.Fort);
      }).to.throw(
        "Il est impossible de construire : vous n'avez pas assez de sesterces. Cette action coûte 2 sesterce(s)."
      );
    });
  });

  describe("placeBid method", function() {
    it("should place a bid", function() {
      // given
      expect(game.getPlayerBid(player)).to.equal(undefined);
      player = player.copy({ gold: 8 });
      game = game.updatePlayer(player);
      // when
      game = game.placeBid(player, God.Minerve, 3);
      // then
      expect(game.getPlayerBid(player)).to.deep.equal({
        player: player.name,
        god: "Minerve",
        amount: 3
      });
    });
    it("should place a bid with priests", function() {
      // given
      player = player.addGodCard(GodCard.Priest);
      player = player.addGodCard(GodCard.Priest);
      player = player.addGodCard(GodCard.Priest);
      player = player.copy({ gold: 3 });
      game = game.updatePlayer(player);
      // when
      game = game.placeBid(player, God.Minerve, 6);
      // then
      expect(game.getPlayerByName(player.name).gold).to.equal(3);
      expect(game.getPlayerBid(player).amount).to.equal(6);
    });
    it("should throw an exception because not enough gold", function() {
      // given
      player = player.copy({ gold: 3 });
      game = game.updatePlayer(player);
      // then
      expect(function() {
        game.placeBid(player, God.Minerve, 4);
      }).to.throw(
        "Il est impossible de placer cette enchère : vous n'avez pas assez de sesterces."
      );
    });
    it("should throw an exception because bidding twice on the same god", function() {
      // given
      player = player.copy({ gold: 3 });
      game = game.updatePlayer(player);
      // then
      game = game.placeBid(player, God.Minerve, 2);
      expect(function() {
        game.placeBid(player, God.Minerve, 3);
      }).to.throw(
        "Il est impossible de placer cette enchère : il est mpossible de surenchérir sur le même dieu."
      );
    });
  });
});
