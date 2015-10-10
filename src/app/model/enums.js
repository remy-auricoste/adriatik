Building.Fort = new Building({name: "fort"});
Building.Port = new Building({name: "port"});
Building.Universite = new Building({name: "université"});
Building.Temple = new Building({name: "temple"});

Unit.Troup = new Unit({type: "earth", territoryType: "earth"});
Unit.Ship = new Unit({type: "sea", territoryType: "sea"});
Unit.Elite = new Unit({type: "elite", territoryType: "earth"});

God.Jupiter = new God({
  name: "Jupiter",
  color: "white",
  building: Building.Temple
});
God.Pluton = new God({
  name: "Pluton",
  color: "black"
});
God.Neptune = new God({
  name: "Neptune",
  color: "green",
  building: Building.Port,
  unit: Unit.Ship,
  unitPrice: function(index) {
    return [0, 1, 2, 3][index];
  }
});
God.Minerve = new God({
  name: "Minerve",
  color: "blue",
  building: Building.Universite
});
God.Mars = new God({
  name: "Mars",
  color: "red",
  building: Building.Fort,
  unit: Unit.Troup,
  unitPrice: function(index) {
    return [0, 2, 3, 4][index];
  }
});
God.Apollon = new God({
  name: "Apollon",
  color: "yellow"
});
