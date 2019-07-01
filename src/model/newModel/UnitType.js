class UnitType {
  constructor({ id, label, territoryType }) {
    this.id = id;
    this.label = label;
    this.territoryType = territoryType;
  }
}

UnitType.Legionnaire = new UnitType({
  id: "legionnaire",
  label: "Légionnaire",
  territoryType: "earth"
});
UnitType.Ship = new UnitType({
  id: "ship",
  label: "Trièreme",
  territoryType: "sea"
});
UnitType.Gladiator = new UnitType({
  id: "gladiator",
  label: "Gladiateur",
  territoryType: "earth"
});

module.exports = UnitType;
