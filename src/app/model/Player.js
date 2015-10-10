Player = Meta.declareClass("Player", {
  name: "",
  gold: 1,
  priests: 1,
  thinkers: 1,
  color: "",
  troupsLeft: {},
  god: "God",
  init: function() {
    if (!this.priests) {
      this.priests = 0;
    }
    if (!this.thinkers) {
      this.thinkers = 0;
    }
  },
  build: function(territory) {
    if (!this.god) {
      throw new Error("Impossible de construire : aucun dieu n'est sélectionné");
    }
    if (!territory.buildSlots) {
      throw new Error("Impossible de construire : aucun emplacement libre sur le territoire sélectionné");
    }
    if (!this.god.building) {
      throw new Error("Impossible de construire : ce dieu ne peut pas construire ce tour-ci");
    }
    if (this.gold < 2) {
      throw new Error("Impossible de construire : pas assez d'or");
    }
    this.gold -= 2;
    territory.buildSlots -= 1;
    territory.buildings.push(this.god.building);

  }
});

Player.new = function(name, color) {
  return new Player({
    name: name,
    color: color,
    gold: 7,
    troupsLeft: {
      earth: 7,
      sea: 7,
      elite: 3
    }
  })
}
