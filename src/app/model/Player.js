Player = Meta.declareClass("Player", {
    name: "",
    avatar: "",
    gold: 1,
    priests: 1,
    philosophers: 1,
    color: "",
    unitsLeft: {},
    unitBuyCount: 1,
    cardBuyCount: 1,
    gladiatorMoveCount: 1,
    god: "God",
    cards: {},
    bid: {},
    randomFactory: {},
    initCount: {},
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
    },
    build: function (territory) {
        try {
            this.requireGod();
            if (!territory.buildSlots) {
                throw new Error("aucun emplacement libre sur le territoire sélectionné.");
            }
            if (!this.god.building) {
                throw new Error("ce dieu ne peut pas construire ce tour-ci.");
            }
            this.spend(2);
        } catch (err) {
            throw new Error("Impossible de construire : " + err.message);
        }
        territory.buildSlots -= 1;
        territory.buildings.push(this.god.building);
    },
    buyUnit: function (territory) {
        try {
            this.requireGod();
            if (!this.god.unitType) {
                throw new Error("Ce dieu ne peut pas vous fournir d'unité.");
            }
            var price = this.god.unitPrice()[this.unitBuyCount];
            if (!price && price !== 0) {
                throw new Error("Il n'y a plus d'unité à acheter.");
            }
            if (territory.owner !== this) {
                throw new Error("Vous ne pouvez acheter des unités que sur des territoires que vous contrôlez")
            }
            this.spend(price);
            territory.placeUnit(new Unit({type: this.god.unitType, owner: this}));
            this.unitBuyCount++;
        } catch (err) {
            throw new Error("Impossible d'acheter une unité : " + err.message);
        }
    },
    spend: function (number) {
        if (this.gold < number) {
            throw new Error("Pas assez de pièces. Cette action coûte " + number + " pièces.");
        }
        this.gold -= number;
    },
    requireGod: function () {
        if (!this.god) {
            throw new Error("Aucun dieu n'est sélectionné.");
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
                throw new Error("Ce dieu ne peut pas vous fournir de carte.");
            }
            var price = this.god.cardPrice()[this.cardBuyCount];
            if (!price && price !== 0) {
                throw new Error("Il n'y a plus de carte à acheter.");
            }
            this.spend(price);
            this.addGodCard(this.god.card);
            this.cardBuyCount++;
            return this.god.card;
        } catch (err) {
            throw new Error("Impossible d'acheter une carte : " + err.message);
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
                    throw new Error("Pas assez d'or.");
                }
                if (god.bid && number <= god.bid.gold) {
                    throw new Error("L'enchère n'est pas assez importante.");
                }
                if (this.bid && god === this.bid.god) {
                    throw new Error("Impossible de surenchérir sur le même dieu.");
                }
            }
            this.bid = new Bid({god: god, gold: number});
            god.bid = this.bid;
        } catch (err) {
            throw new Error("Impossible de placer cette enchère : " + err.message);
        }
    },
    payBid: function () {
        var goldLeft = this.bid.gold - this.getPriests();
        var payment = Math.max(1, goldLeft);
        this.spend(payment);
        this.god = this.bid.god;
        return payment;
    },
    move: function (units, fromTerritory, toTerritorry) {
        try {
            if (!units || !units.length) {
                throw new Error("Aucune unité sélectionnée.");
            }
            this.requireGod();
            if (this.god === God.Ceres) {
                throw new Error("Ceres ne peut pas déplacer d'unité.");
            }
            if (fromTerritory.neighbours.indexOf(toTerritorry.id) === -1) {
                throw new Error("Le territoire de destination n'est pas adjacent au territoire de départ.");
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
                throw new Error("Vous n'avez pas les faveurs du dieu correspondant.");
            }
            return this.resolveMove(units, fromTerritory, toTerritorry);
        } catch (err) {
            throw new Error("Impossible de déplacer des unités : " + err.message);
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
                var otherPlayer = toTerritorry.owner;
                var fightResult = self.resolveFight(toTerritorry, randoms[0], randoms[1]);
                var getResult = function (player) {
                    var loss = fightResult[player.name];
                    var lossLeft = loss && player.resolveLoss(toTerritorry) ? (loss - 1) : loss;
                    return {
                        loss: loss,
                        lossLeft: lossLeft
                    }
                }
                var losses = {};
                losses[self.name] = getResult(self);
                losses[otherPlayer.name] = getResult(otherPlayer);
                return {
                    losses: losses
                };
            });
        }
    },
    resolveFight: function (territory, randomValue1, randomValue2) {
        var owner1 = territory.units[0].owner;
        var owner2 = territory.units.filter(function (unit) {
            return unit.owner !== owner1;
        })[0].owner;
        var getStrength = function (owner, randomValue) {
            return territory.getUnits(owner).length + Dice(randomValue);
        }
        var strength1 = getStrength(owner1, randomValue1);
        var strength2 = getStrength(owner2, randomValue2);
        var loss1 = strength1 <= strength2 ? 1 : 0;
        var loss2 = strength2 <= strength1 ? 1 : 0;
        var result = {};
        result[owner1.name] = loss1;
        result[owner2.name] = loss2;
        return result;
    },
    resolveLoss: function (territory) {
        var self = this;
        var units = territory.getUnits(self);
        var hasLegionnaire = units.filter(function (unit) {
            return unit.type === UnitType.Legionnaire;
        }).length;
        var hasGladiator = units.filter(function (unit) {
            return unit.type === UnitType.Gladiator;
        }).length;
        if (hasGladiator && hasLegionnaire) {
            return false;
        } else {
            var unit = units[0];
            territory.removeUnit(unit);
            return unit;
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
                throw new Error("Le territoire de départ et de destination doivent être du même type.");
            }
            if (this.possibleRetreats(fromTerritory).indexOf(toTerritorry) === -1) {
                throw new Error("Cette retraite n'est pas valide. Veuillez choisir un territoire que vous contrôlez ou inoccupé.");
            }
            var units = fromTerritory.getUnits(self);
            return this.resolveMove(units, fromTerritory, toTerritorry);
        } catch (err) {
            throw new Error("Impossible de retraiter : " + err.message);
        }
    },
    initBuilding: function (territory, building) {
        try {
            if (!(this.god && this.god.canBuild(building))) {
                throw new Error("Le dieu choisi ne peut pas construire ce bâtiment.");
            }
            if (territory.owner !== this) {
                throw new Error("Vous devez contrôller le territoire pour y placer un bâtiment.");
            }
            territory.buildings.push(building);
        } catch (err) {
            throw new Error("Impossible de placer ce bâtiment : " + err.message);
        }
    }
});

Player.new = function (name, hash, color) {

    return new Player({
        name: name,
        avatar: "http://www.gravatar.com/avatar/" + hash + "?s=50",
        color: color,
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
