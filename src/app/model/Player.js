Player = Meta.declareClass("Player", {
  name: "",
  gold: 1,
  priests: 1,
  thinkers: 1,
  color: "",
  troupsLeft: {},
  unitBuyCount: 1,
  cardBuyCount: 1,
  god: "God",
  cards: {},
  init: function() {
    if (!this.priests) {
      this.priests = 0;
    }
    if (!this.thinkers) {
      this.thinkers = 0;
    }
    if (!this.unitBuyCount) {
      this.unitBuyCount = 0;
    }
    if (!this.cardBuyCount) {
      this.cardBuyCount = 0;
    }
    if (!this.cards) {
      this.cards = {};
    }
  },
  build: function(territory) {
    try {
      this.requireGod();
      if (!territory.buildSlots) {
        throw new Error("aucun emplacement libre sur le territoire sélectionné");
      }
      if (!this.god.building) {
        throw new Error("ce dieu ne peut pas construire ce tour-ci");
      }
      this.spend(2);
    } catch(err) {
      throw new Error("Impossible de construire : "+err.message);
    }
    territory.buildSlots -= 1;
    territory.buildings.push(this.god.building);
  },
  buyUnit: function(territory) {
    try {
      this.requireGod();
      if (!this.god.unit) {
        throw new Error("ce dieu ne peut pas vous fournir d'unité");
      }
      var price = this.god.unitPrice(this.unitBuyCount);
      if (!price && price !== 0) {
        throw new Error("il n'y a plus d'unité à acheter");
      }
      this.spend(price);
      territory.placeUnit(this.god.unit);
      this.unitBuyCount++;
    } catch(err) {
      throw new Error("Impossible d'acheter une unité : "+err.message);
    }
  },
  spend: function(number) {
    if (this.gold < number) {
      throw new Error("pas assez de pièces. Cette action coûte "+number+" pièces");
    }
    this.gold -= number;
  },
  requireGod: function() {
    if (!this.god) {
      throw new Error("aucun dieu n'est sélectionné");
    }
  },
  buyGodCard: function() {
    try {
      this.requireGod();
      if (!this.god.card) {
        throw new Error("ce dieu ne peut pas vous fournir de carte");
      }
      var price = this.god.cardPrice(this.cardBuyCount);
      if (!price && price !== 0) {
        throw new Error("il n'y a plus de carte à acheter");
      }
      this.spend(price);
      var currentValue = this.cards[this.god.card.name];
      if (!currentValue) {
        this.cards[this.god.card.name] = 0;
      }
      this.cards[this.god.card.name]++;
      this.cardBuyCount++;
      return this.god.card;
    } catch(err) {
      throw new Error("Impossible d'acheter une carte : "+err.message);
    }
  },
  placeBid: function(god, number) {
    try {
      var priests = this.cards[GodCard.Priest.name];
      priests = priests ? priests : 0;
      if (number > this.gold + priests) {
        throw new Error("pas assez d'or");
      }
    } catch(err) {
      throw new Error("Impossible de placer cette enchère : "+err.message);
    }
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
