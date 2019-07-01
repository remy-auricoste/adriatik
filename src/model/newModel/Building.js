class Building {
  constructor({ id, label }) {
    this.id = id;
    this.label = label;
  }
}

Building.Fort = new Building({ id: "fort", label: "Fort" });
Building.Port = new Building({ id: "port", label: "Port" });
Building.University = new Building({ id: "university", label: "Université" });
Building.Temple = new Building({ id: "temple", label: "Temple" });
Building.Cite = new Building({ id: "cite", label: "Cité" });

module.exports = Building;
