Building.Fort = new Building({name: "fort"});
Building.Port = new Building({name: "port"});
Building.Universite = new Building({name: "université"});
Building.Temple = new Building({name: "temple"});

UnitType.Troup = new UnitType({type: "earth", territoryType: "earth"});
UnitType.Ship = new UnitType({type: "sea", territoryType: "sea"});
UnitType.Elite = new UnitType({type: "elite", territoryType: "earth"});

GodCard.Priest = new GodCard({name: "prêtre"});
GodCard.Thinker = new GodCard({name: "philosophe"});

God.Jupiter = new God({
  name: "Jupiter",
  color: "white",
  building: Building.Temple,
  card: GodCard.Priest,
  cardPrice: function(index) {
    return [0, 4][index];
  }
});
God.Pluton = new God({
  name: "Pluton",
  color: "black",
  unit: UnitType.Elite,
  unitPrice: function(index) {
    if (this.index === 0) {
      return [0, 2][index];
    } else {
      return [2][index];
    }
  }
});
God.Neptune = new God({
  name: "Neptune",
  color: "green",
  building: Building.Port,
  unit: UnitType.Ship,
  unitPrice: function(index) {
    return [0, 1, 2, 3][index];
  }
});
God.Minerve = new God({
  name: "Minerve",
  color: "blue",
  building: Building.Universite,
  card: GodCard.Thinker,
  cardPrice: function(index) {
    return [0, 4][index];
  }
});
God.Mars = new God({
  name: "Mars",
  color: "red",
  building: Building.Fort,
  unit: UnitType.Troup,
  unitPrice: function(index) {
    return [0, 2, 3, 4][index];
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
