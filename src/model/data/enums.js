var Territory = require("./Territory");
var Building = require("./Building");
var Unit = require("./Unit");
var Player = require("./Player");
var UnitType = require("./UnitType");
var GodCard = require("./GodCard");
var CreatureCard = require("./CreatureCard");
var God = require("./God");

Building.Fort = new Building({name: "fort", label: "Fort"});
Building.Port = new Building({name: "port", label: "Port"});
Building.University = new Building({name: "university", label: "Université"});
Building.Temple = new Building({name: "temple", label: "Temple"});
Building.Cite = new Building({name: "cite", label: "Cité"});

UnitType.Legionnaire = new UnitType({name: "legionnaire", label: "Légionnaire", territoryType: "earth"});
UnitType.Ship = new UnitType({name: "ship", label: "Trièreme", territoryType: "sea"});
UnitType.Gladiator = new UnitType({name: "gladiator", label: "Gladiateur", territoryType: "earth"});

GodCard.Priest = new GodCard({name: "priest"});
GodCard.Philosopher = new GodCard({name: "philosopher"});

God.Jupiter = new God({
    name: "Jupiter",
    color: "white",
    building: Building.Temple,
    card: GodCard.Priest,
    cardPrice: function () {
        return [0, 4];
    }
});
God.Pluton = new God({
    name: "Pluton",
    color: "black",
    unitType: UnitType.Gladiator,
    unitPrice: function () {
        if (this.index === 0) {
            return [0, 2];
        } else {
            return [2];
        }
    }
});
God.Pluton.canBuild = function () {
    return true;
}
God.Neptune = new God({
    name: "Neptune",
    color: "green",
    building: Building.Port,
    unitType: UnitType.Ship,
    unitPrice: function () {
        return [0, 1, 2, 3];
    }
});
God.Junon = new God({
    name: "Junon",
    color: "blue",
    building: Building.University,
    card: GodCard.Philosopher,
    cardPrice: function () {
        return [0, 4];
    }
});
God.Minerve = new God({
    name: "Minerve",
    color: "red",
    building: Building.Fort,
    unitType: UnitType.Legionnaire,
    unitPrice: function () {
        return [0, 2, 3, 4];
    }
});
God.Ceres = new God({
    name: "Ceres",
    color: "yellow"
});

new CreatureCard({
  name: "Pégase",
  targetTypes: [[Unit], Territory],
  action: function(game, player, units, territory) {

  }
});
new CreatureCard({
  name: "armée des morts",
  targetTypes: [],
  action: function(game, player) {
    var income = player.lastIncome;
    player.gold += income;
    // TODO message
  }
});
new CreatureCard({
  name: "Griffon",
  targetTypes: [Player],
  action: function(game, player, stolenPlayer) {
    var initGold = stolenPlayer.gold;
    var stolenGold = Math.floor(initGold / 2);
    player.gold += stolenGold;
    stolenPlayer.gold -= stolenGold;
    // TODO emit message command
  }
});
new CreatureCard({
  name: "Kraken",
  targetTypes: [Territory],
  action: function(game, player, territory) {

  }
});
new CreatureCard({
  name: "Harpie",
  targetTypes: [Territory],
  action: function(game, player, territory) {
    var units = territory.units.filter(function(unit) {
      return unit.type === UnitType.Legionnaire && unit.owner !== player;
    });
    if (units.length) {
      territory.units.splice(territory.units.indexOf(units[0]), 1);
    }
    // TODO message
  }
});
new CreatureCard({
  name: "Minotaure",
  targetTypes: [Territory],
  action: function(game, player, territory) {

  }
});
new CreatureCard({
  name: "Méduse",
  targetTypes: [Territory],
  action: function(game, player, territory) {
  }
});
new CreatureCard({
  name: "Cyclope",
  targetTypes: [Territory],
  action: function(game, player, territory) {
  }
});
new CreatureCard({
  name: "Centaure",
  targetTypes: [Territory],
  action: function(game, player, territory) {
  }
});
new CreatureCard({
  name: "Sphinx",
  targetTypes: [],
  action: function(game, player) {
    // TODO activate state on player so that he can trade cards / units for 2 gold
  }
});
