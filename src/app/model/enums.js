CommandType.Build = new CommandType({name: "build", methodName: "build", argCount: 1});
CommandType.BuyUnit = new CommandType({name: "buyUnit", methodName: "buyUnit", argCount: 1});
CommandType.BuyCard = new CommandType({name: "buyCard", methodName: "buyGodCard", argCount: 1});
CommandType.Move = new CommandType({name: "move", methodName: "move", argCount: 3});
CommandType.Bid = new CommandType({name: "bid", methodName: "placeBid", argCount: 2});
CommandType.Retreat = new CommandType({name: "retreat", methodName: "retreat", argCount: 2});
CommandType.InitUnit = new CommandType({name: "initUnit", methodName: "initUnit", argCount: 1});
CommandType.InitBuilding = new CommandType({name: "initBuilding", methodName: "initBuilding", argCount: 2});

Building.Fort = new Building({name: "fort"});
Building.Port = new Building({name: "port"});
Building.University = new Building({name: "university"});
Building.Temple = new Building({name: "temple"});

UnitType.Legionnaire = new UnitType({name: "legionnaire", territoryType: "earth"});
UnitType.Ship = new UnitType({name: "ship", territoryType: "sea"});
UnitType.Gladiator = new UnitType({name: "gladiator", territoryType: "earth"});

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
God.all = [
    God.Jupiter
    , God.Pluton
    , God.Neptune
    , God.Junon
    , God.Minerve
    , God.Ceres
]

var Phases = {
    bidding: "Enchères",
    actions: "Actions"
}
