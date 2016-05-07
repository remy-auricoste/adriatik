var Meta = require("../../alias/Meta");
var UnitType = require("./UnitType");
var God = require("./God");
var GodCard = require("./GodCard");
var Battle = require("./Battle");
var Territory = require("./Territory");
var Bid = require("./Bid");
var Unit = require("./Unit");

var randomFactory = require("../../services/randomFactory")

Player = Meta.declareClass("Player", {
    _primary: "name",
    name: "",
    lastIncome: 1,
    gold: 1,
    unitsLeft: {},
    unitBuyCount: 1,
    cardBuyCount: 1,
    gladiatorMoveCount: 1,
    god: "God",
    cards: {},
    bid: "Bid",
    initCount: {},
    initBuildCount: 1,
    account: {},
    templeUsed: 1,
    init: function () {
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
        if (!this.lastIncome) {
          this.lastIncome = 0;
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
        if (!this.initBuildCount) {
          this.initBuildCount = 0;
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
            throw err.prefix("Il est impossible de construire : ");
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
            throw err.prefix("Il est impossible d'acheter une unité : ")
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
    buyGodCard: function() {
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
            throw err.prefix("Il est impossible d'acheter une carte : ");
        }
    },
    getGodCardCount: function(godCard) {
        var result = this.cards[godCard.name];
        result = result ? result : 0;
        return result;
    },
    getPriests: function () {
        return this.getGodCardCount(GodCard.Priest);
    },
    getPhilosophers: function () {
        return this.getGodCardCount(GodCard.Philosopher);
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
    findPathBySea: function(fromTerritory, toTerritorry, currentPath, passedTerritories) {
      var self = this;
      if (!passedTerritories) {
        passedTerritories = [];
      }
      if (!currentPath) {
        currentPath = [];
      }
      if (fromTerritory.neighbours.indexOf(toTerritorry.id) !== -1) {
        return currentPath.concat([toTerritorry]);
      }
      var neighbourIdsLeft = fromTerritory.neighbours.diff(passedTerritories.map(function(territory) {return territory.id}));
      if (neighbourIdsLeft.length === 0) {
        return null;
      }
      var possibleNeighbours = neighbourIdsLeft.map(function(id) {
        return Territory.byId(id);
      }).filter(function(territory) {
        return territory && territory.type === "sea" && territory.owner === self;
      });
      passedTerritories.push(fromTerritory);
      console.log("passed territories", passedTerritories.length);
      return Meta.find(possibleNeighbours, function(territory) {
        return self.findPathBySea(territory, toTerritorry, currentPath.concat([territory]), passedTerritories);
      });
    },
    checkValidMove: function(units, fromTerritory, toTerritorry) {
        if (fromTerritory === toTerritorry) {
            throw new Error("vos troupes sont déjà sur ce territoire");
        }
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
        if (!this.findPathBySea(fromTerritory, toTerritorry)) {
            throw new Error("le territoire de destination n'est pas adjacent au territoire de départ.");
        }
    },
    move: function (units, fromTerritory, toTerritorry) {
        try {
            this.checkValidMove(units, fromTerritory, toTerritorry);
            if (this.god === God.Ceres) {
                throw new Error("Ceres ne peut pas déplacer d'unité.");
            }

            var gladiators = units.filter(function (unit) {
                return unit.type === UnitType.Gladiator;
            });
            if (fromTerritory.type === "sea" && this.god === God.Neptune) {
                this.spend(1);
            } else if (fromTerritory.type === "earth" && this.god === God.Minerve) {
                this.spend(1);
            } else if (fromTerritory.type === "earth" && gladiators.length) {
                this.spend(this.gladiatorMoveCount+1);
                this.gladiatorMoveCount++;
            } else {
                throw new Error("vous n'avez pas les faveurs du dieu correspondant.");
            }
            return this.resolveMove(units, fromTerritory, toTerritorry);
        } catch (err) {
            throw err.prefix("Il est impossible de déplacer des unités : ");
        }
    },
    resolveMove: function (units, fromTerritory, toTerritorry) {
        var self = this;
        var destIsEmpty = toTerritorry.isEmpty();
        fromTerritory.moveUnits(units, toTerritorry);
        if (toTerritorry.hasConflict()) {
          return self.generateBattle(toTerritorry);
        } else {
          toTerritorry.owner = self;
        }
    },
    generateBattle: function(territory) {
        return randomFactory.generate(2).then(function (randoms) {
            var battle = Battle.new(randoms, territory);
            console.log("battle", battle);
            return battle;
        });
    },
    resolveBattle: function(battle, options) {
        if (options.unit) {
          console.log("resolveBattle : removing unit");
          battle.territory.removeUnit(options.unit);
          battle.getState(this).setLoss(options.unit);
        }
        if (options.retreatTerritory) {
          console.log("resolveBattle : retreating...");
          battle.getState(this).retreat();
          this.retreat(battle.territory, options.retreatTerritory);
        }
        if (options.stay) {
          battle.getState(this).stay();
        }
        console.log("battle fully resolved", battle.isFullyResolved());
        if (battle.isFullyResolved()) {
          if (battle.territory.hasConflict()) {
            console.log("no retreats, generating new battle");
            return this.generateBattle(battle.territory);
          } else {
            var units = battle.territory.units;
            if (units.length) {
              battle.territory.owner = units[0].owner;
            }
            console.log("battle is over");
            return true; // battle is over
          }
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
            throw err.prefix("Il est impossible de retraiter : ");
        }
    },
    initBuilding: function (territory, building) {
        try {
            if (territory.type !== "earth") {
                throw new Error("vous ne pouvez construire que sur les territoires terrestres");
            }
            if (this.initBuildCount) {
                throw new Error("vous avez déjà construit votre bâtiment gratuit.");
            }
            if (!(this.god && this.god.canBuild(building))) {
                throw new Error("le dieu choisi ne peut pas construire ce bâtiment.");
            }
            if (territory.owner !== this) {
                throw new Error("vous devez contrôller le territoire pour y placer un bâtiment.");
            }
            territory.buildings.push(building);
            this.initBuildCount++;
        } catch (err) {
            throw err.prefix("Il est impossible de placer ce bâtiment : ");
        }
    }
});

Player.new = function (name) {

    return new Player({
        name: name,
        gold: 7,
        unitsLeft: {
            earth: 8,
            sea: 8,
            gladiator: 3
        }
    })
}

module.exports = Player;
