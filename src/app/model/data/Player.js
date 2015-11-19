Player = Meta.declareClass("Player", {
    _primary: "name",
    name: "",
    lastIncome: 1,
    gold: 1,
    priests: 1,
    philosophers: 1,
    unitsLeft: {},
    unitBuyCount: 1,
    cardBuyCount: 1,
    gladiatorMoveCount: 1,
    god: "God",
    cards: {},
    bid: "Bid",
    randomFactory: {},
    initCount: {},
    account: {},
    templeUsed: 1,
    init: function () {
        if (!this.priests) {
            this.priests = 0;
        }
        if (!this.philosophers) {
            this.philosophers = 0;
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
        if (!this.gladiatorMoveCount) {
            this.gladiatorMoveCount = 0;
        }
        if (!this.initCount) {
            this.initCount = {};
            for (var name in UnitType.all) {
                this.initCount[UnitType.all[name].name] = 0;
            }
        }
        if (!this.templeUsed) {
          this.templeUsed = 0;
        }
    },
    build: function (territory) {
        try {
            this.requireGod();
            if (!territory.buildSlots) {
                throw new Error("il n'y a aucun emplacement libre sur le territoire sélectionné.");
            }
            if (!this.god.building) {
                throw new Error("ce dieu ne peut pas construire ce tour-ci.");
            }
            this.spend(2);
        } catch (err) {
            throw new Error("Il est impossible de construire : " + err.message);
        }
        territory.buildSlots -= 1;
        territory.buildings.push(this.god.building);
    },
    buyUnit: function (territory) {
        try {
            this.requireGod();
            if (!this.god.unitType) {
                throw new Error("ce dieu ne peut pas vous fournir d'unité.");
            }
            var price = this.god.unitPrice()[this.unitBuyCount];
            if (!price && price !== 0) {
                throw new Error("il n'y a plus d'unité à acheter.");
            }
            if (territory.owner !== this) {
                throw new Error("vous ne pouvez acheter des unités que sur des territoires que vous contrôlez")
            }
            this.spend(price);
            territory.placeUnit(new Unit({type: this.god.unitType, owner: this}));
            this.unitBuyCount++;
        } catch (err) {
            throw new Error("Il est impossible d'acheter une unité : " + err.message);
        }
    },
    spend: function (number) {
        if (this.gold < number) {
            throw new Error("vous n'avez pas assez de sesterces. Cette action coûte " + number + " sesterce(s).");
        }
        this.gold -= number;
    },
    requireGod: function () {
        if (!this.god) {
            throw new Error("vous n'avez sélectionné aucun dieu.");
        }
    },
    addGodCard: function (card) {
        var currentValue = this.cards[card.name];
        if (!currentValue) {
            this.cards[card.name] = 0;
        }
        this.cards[card.name]++;
    },
    buyGodCard: function () {
        try {
            this.requireGod();
            if (!this.god.card) {
                throw new Error("ce dieu ne peut pas vous fournir de carte.");
            }
            var price = this.god.cardPrice()[this.cardBuyCount];
            if (!price && price !== 0) {
                throw new Error("il n'y a plus de carte à acheter.");
            }
            this.spend(price);
            this.addGodCard(this.god.card);
            this.cardBuyCount++;
            return this.god.card;
        } catch (err) {
            throw new Error("Il est impossible d'acheter une carte : " + err.message);
        }
    },
    getPriests: function () {
        var priests = this.cards[GodCard.Priest.name];
        priests = priests ? priests : 0;
        return priests;
    },
    placeBid: function (god, number) {
        try {
            if (god === God.Ceres) {
                number = 0;
                god.playerNames.push(this.name);
            } else {
                if (number > this.gold + this.getPriests()) {
                    throw new Error("vous n'avez pas assez de sesterces.");
                }
                if (god.bid && number <= god.bid.gold) {
                    throw new Error("votre enchère n'est pas assez importante.");
                }
                if (this.bid && god.name === this.bid.godName) {
                    throw new Error("il est mpossible de surenchérir sur le même dieu.");
                }
            }
            this.bid = new Bid({godName: god.name, gold: number});
            god.bid = this.bid;
        } catch (err) {
            throw new Error("Il est impossible de placer cette enchère : " + err.message);
        }
    },
    payBid: function () {
        var goldLeft = this.bid.gold - this.getPriests();
        var payment = Math.max(1, goldLeft);
        this.spend(payment);
        this.god = this.bid.getGod();
        return payment;
    },
    move: function (units, fromTerritory, toTerritorry) {
        try {
            if (!units || !units.length) {
                throw new Error("il n'y a aucune unité sélectionnée.");
            }
            var allInTerritory = Meta.forall(units, function(unit) {
              return fromTerritory.units.indexOf(unit) !== -1;
            });
            if (!allInTerritory) {
              throw new Error("toutes les unités doivent partir du même territoire et arriver sur le même territoire");
            }
            this.requireGod();
            if (this.god === God.Ceres) {
                throw new Error("Ceres ne peut pas déplacer d'unité.");
            }
            if (fromTerritory.neighbours.indexOf(toTerritorry.id) === -1) {
                throw new Error("le territoire de destination n'est pas adjacent au territoire de départ.");
            }
            var gladiators = units.filter(function (unit) {
                return unit.type === UnitType.Gladiator;
            });
            if (fromTerritory.type === "sea" && this.god === God.Neptune) {
                this.spend(1);
            } else if (fromTerritory.type === "earth" && this.god === God.Minerve) {
                this.spend(1);
            } else if (fromTerritory.type === "earth" && gladiators.length) {
                this.gladiatorMoveCount++;
                this.spend(this.gladiatorMoveCount);
            } else {
                throw new Error("vous n'avez pas les faveurs du dieu correspondant.");
            }
            return this.resolveMove(units, fromTerritory, toTerritorry);
        } catch (err) {
            throw new Error("Il est impossible de déplacer des unités : " + err.message);
        }
    },
    resolveMove: function (units, fromTerritory, toTerritorry) {
        var self = this;
        var destIsEmpty = toTerritorry.isEmpty();
        fromTerritory.moveUnits(units, toTerritorry);
        if (destIsEmpty) {
            toTerritorry.owner = self;
        } else {
            return self.randomFactory.generate(2).then(function (randoms) {
                var battle = new Battle({
                  randoms: randoms,
                  territory: toTerritorry
                });
                return battle;
            });
        }
    },
    possibleRetreats: function (territory) {
        var self = this;
        var neighbours = territory.neighbours.map(function (id) {
            return Territory.byId(id);
        });
        var friendly = neighbours.filter(function (territory) {
            return territory.isFriendly(self);
        });
        // TODO handle retreats using ships
        return friendly;
    },
    retreat: function (fromTerritory, toTerritorry) {
        var self = this;
        try {
            if (fromTerritory.type !== toTerritorry.type) {
                throw new Error("le territoire de départ et de destination doivent être du même type.");
            }
            if (this.possibleRetreats(fromTerritory).indexOf(toTerritorry) === -1) {
                throw new Error("cette retraite n'est pas valide. Veuillez choisir un territoire que vous contrôlez ou inoccupé.");
            }
            var units = fromTerritory.getUnits(self);
            return this.resolveMove(units, fromTerritory, toTerritorry);
        } catch (err) {
            throw new Error("Il est impossible de retraiter : " + err.message);
        }
    },
    initBuilding: function (territory, building) {
        try {
            if (!(this.god && this.god.canBuild(building))) {
                throw new Error("le dieu choisi ne peut pas construire ce bâtiment.");
            }
            if (territory.owner !== this) {
                throw new Error("vous devez contrôller le territoire pour y placer un bâtiment.");
            }
            territory.buildings.push(building);
        } catch (err) {
            throw new Error("Il est impossible de placer ce bâtiment : " + err.message);
        }
    }
});

Player.new = function (name) {

    return new Player({
        name: name,
        gold: 7,
        priests: 5,
        philosophers: 5,
        unitsLeft: {
            earth: 7,
            sea: 7,
            gladiator: 3
        }
    })
}
