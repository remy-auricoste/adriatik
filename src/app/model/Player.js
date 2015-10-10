Player = Meta.declareClass("Player", {
  name: "",
  gold: 1,
  priests: 1,
  thinkers: 1,
  color: "",
  troupsLeft: {},
  buyCount: 1,
  god: "God",
  init: function() {
    if (!this.priests) {
      this.priests = 0;
    }
    if (!this.thinkers) {
      this.thinkers = 0;
    }
    if (!this.buyCount) {
      this.buyCount = 0;
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
    try {
      this.spend(2);
    } catch(err) {
      throw new Error("Impossible de construire : "+err.message);
    }
    territory.buildSlots -= 1;
    territory.buildings.push(this.god.building);
  },
  buyUnit: function(territory) {
    if (!this.god) {
      throw new Error("Impossible d'acheter une unité : aucun dieu n'est sélectionné");
    }
    if (!this.god.unit) {
      throw new Error("Impossible d'acheter une unité : ce dieu ne peut pas vous fournir d'unité");
    }
    var price = this.god.unitPrice(this.buyCount);
    try {
      this.spend(price);
      territory.placeUnit(this.god.unit);
      this.buyCount++;
    } catch(err) {
      throw new Error("Impossible d'acheter une unité : "+err.message);
    }
  },
  spend: function(number) {
    if (this.gold < number) {
      throw new Error("pas assez de pièces. Cette action coûte "+number+" pièces");
    }
    this.gold -= number;
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
