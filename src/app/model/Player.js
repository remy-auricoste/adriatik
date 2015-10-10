Player = Meta.declareClass("Player", {
  name: "",
  gold: 1,
  priests: 1,
  thinkers: 1,
  color: "",
  troupsLeft: {},
  unitBuyCount: 1,
  cardBuyCount: 1,
  eliteMoveCount: 1,
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
    if (!this.eliteMoveCount) {
      this.eliteMoveCount = 0;
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
  addGodCard: function(card) {
    var currentValue = this.cards[card.name];
    if (!currentValue) {
      this.cards[card.name] = 0;
    }
    this.cards[card.name]++;
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
      this.addGodCard(this.god.card);
      this.cardBuyCount++;
      return this.god.card;
    } catch(err) {
      throw new Error("Impossible d'acheter une carte : "+err.message);
    }
  },
  getPriests: function() {
    var priests = this.cards[GodCard.Priest.name];
    priests = priests ? priests : 0;
    return priests;
  },
  placeBid: function(god, number) {
    try {
      if (number > this.gold + this.getPriests()) {
        throw new Error("pas assez d'or");
      }
      this.bid = new Bid({god: god, gold: number});
    } catch(err) {
      throw new Error("Impossible de placer cette enchère : "+err.message);
    }
  },
  payBid: function() {
    var goldLeft = this.bid.gold - this.getPriests();
    var payment = Math.max(1, goldLeft);
    this.spend(payment);
    return payment;
  },
  move: function(units, fromTerritory, toTerritorry) {
    try {
      if (!units || !units.length) {
        throw new Error("aucune unité sélectionnée");
      }
      this.requireGod();
      if (this.god === God.Apollon) {
        throw new Error("Apollon ne peut pas déplacer d'unité");
      }
      if (fromTerritory.neighbours.indexOf(toTerritorry.id) === -1) {
        throw new Error("le territoire de destination n'est pas adjacent au territoire de départ");
      }
      var elites = units.filter(function(unit) {
        return unit === Unit.Elite;
      });
      if (fromTerritory.type === "sea" && this.god === God.Neptune) {
        this.spend(1);
      } else if (fromTerritory.type === "earth" && this.god === God.Mars) {
        this.spend(1);
      } else if (fromTerritory.type === "earth" && elites.length) {
        this.eliteMoveCount++;
        this.spend(this.eliteMoveCount);
      } else {
        throw new Error("vous n'avez pas les faveurs du dieu correspondant");
      }
      var destIsEmpty = toTerritorry.isEmpty();
      fromTerritory.moveUnits(units, toTerritorry);
      if (destIsEmpty) {
        toTerritorry.owner = this;
      } else {
        // TODO fight
      }
    } catch(err) {
      throw new Error("Impossible de déplacer des unités : "+err.message);
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
