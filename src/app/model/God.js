var God = Meta.declareClass("God", {
  name: "",
  color: "",
  building: "Building"
});
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
  building: Building.Port
});
God.Minerve = new God({
  name: "Minerve",
  color: "blue",
  building: Building.Universite
});
God.Mars = new God({
  name: "Mars",
  color: "red",
  building: Building.Fort
});
God.Apollon = new God({
  name: "Apollon",
  color: "yellow"
});
