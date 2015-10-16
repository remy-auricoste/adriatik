CommandType.Build = new CommandType({name: "build", methodName: "build", argCount: 1});
CommandType.BuyUnit = new CommandType({name: "buyUnit", methodName: "buyUnit", argCount: 1});
CommandType.BuyCard = new CommandType({name: "buyCard", methodName: "buyGodCard", argCount: 1});
CommandType.Move = new CommandType({name: "move", methodName: "move", argCount: 3});
CommandType.Bid = new CommandType({name: "bid", methodName: "placeBid", argCount: 2});
CommandType.Retreat = new CommandType({name: "retreat", methodName: "retreat", argCount: 2});

Building.Fort = new Building({name: "fort"});
Building.Port = new Building({name: "port"});
Building.Universite = new Building({name: "university"});
Building.Temple = new Building({name: "temple"});

UnitType.Troup = new UnitType({name: "troup", territoryType: "earth"});
UnitType.Ship = new UnitType({name: "ship", territoryType: "sea"});
UnitType.Elite = new UnitType({name: "elite", territoryType: "earth"});

GodCard.Priest = new GodCard({name: "priest"});
GodCard.Thinker = new GodCard({name: "thinker"});

God.Jupiter = new God({
  name: "Jupiter",
  color: "white",
  building: Building.Temple,
  card: GodCard.Priest,
  cardPrice: function() {
    return [0, 4];
  }
});
God.Pluton = new God({
  name: "Pluton",
  color: "black",
  unitType: UnitType.Elite,
  unitPrice: function() {
    if (this.index === 0) {
      return [0, 2];
    } else {
      return [2];
    }
  }
});
God.Neptune = new God({
  name: "Neptune",
  color: "green",
  building: Building.Port,
  unitType: UnitType.Ship,
  unitPrice: function() {
    return [0, 1, 2, 3];
  }
});
God.Minerve = new God({
  name: "Minerve",
  color: "blue",
  building: Building.Universite,
  card: GodCard.Thinker,
  cardPrice: function() {
    return [0, 4];
  }
});
God.Mars = new God({
  name: "Mars",
  color: "red",
  building: Building.Fort,
  unitType: UnitType.Troup,
  unitPrice: function() {
    return [0, 2, 3, 4];
  }
});
God.Apollon = new God({
  name: "Apollon",
  color: "yellow"
});
God.all = [
  God.Jupiter
  , God.Pluton
  , God.Neptune
  , God.Minerve
  , God.Mars
  , God.Apollon
]

var Phases = {
  bidding: "Enchères",
  actions: "Actions"
}
