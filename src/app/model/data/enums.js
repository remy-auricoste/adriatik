CommandType.Build = new CommandType({name: "build", methodName: "build", argCount: 1});
CommandType.BuyUnit = new CommandType({name: "buyUnit", methodName: "buyUnit", argCount: 1});
CommandType.BuyCard = new CommandType({name: "buyCard", methodName: "buyGodCard", argCount: 1});
CommandType.Move = new CommandType({name: "move", methodName: "move", argCount: 3});
CommandType.Bid = new CommandType({name: "bid", methodName: "placeBid", argCount: 2});
CommandType.Retreat = new CommandType({name: "retreat", methodName: "retreat", argCount: 2});
CommandType.InitUnit = new CommandType({name: "initUnit", methodName: "initUnit", argCount: 1});
CommandType.InitBuilding = new CommandType({name: "initBuilding", methodName: "initBuilding", argCount: 2});
CommandType.EndTurn = new CommandType({name: "endTurn", methodName: "endTurn", argCount: 0});

Building.Fort = new Building({name: "fort", label: "Fort"});
Building.Port = new Building({name: "port", label: "Port"});
Building.University = new Building({name: "university", label: "Université"});
Building.Temple = new Building({name: "temple", label: "Temple"});

UnitType.Legionnaire = new UnitType({name: "legionnaire", label: "Légionnaire", territoryType: "earth"});
UnitType.Ship = new UnitType({name: "ship", label: "Trièreme", territoryType: "sea"});
UnitType.Gladiator = new UnitType({name: "gladiator", label: "Gladiateur", territoryType: "earth"});

GodCard.Priest = new GodCard({name: "priest"});
GodCard.Thinker = new GodCard({name: "philosopher"});

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
    card: GodCard.Thinker,
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

var Phases = {
    bidding: "Enchères",
    actions: "Actions"
}

new CreatureCard({
  name: "Pégase",
  targetCount: 2,
  action: function(game, player, units, territory) {

  }
});
new CreatureCard({
  name: "armée des morts",
  targetCount: 0,
  action: function(game, player) {

  }
});
new CreatureCard({
  name: "Griffon",
  targetCount: 1,
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
  targetCount: 1,
  action: function(game, player, territory) {

  }
});
new CreatureCard({
  name: "Harpie",
  targetCount: 1,
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
  targetCount: 1,
  action: function(game, player, territory) {

  }
});
new CreatureCard({
  name: "Méduse",
  targetCount: 1,
  action: function(game, player, territory) {
  }
});
new CreatureCard({
  name: "Cyclope",
  targetCount: 1,
  action: function(game, player, territory) {
  }
});
new CreatureCard({
  name: "Centaure",
  targetCount: 1,
  action: function(game, player, territory) {
  }
});
new CreatureCard({
  name: "Sphinx",
  targetCount: 0,
  action: function(game, player) {
    // TODO activate state on player so that he can trade cards / units for 2 gold
  }
});
