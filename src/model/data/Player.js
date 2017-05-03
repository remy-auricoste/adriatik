var injector = require("../../core/MyInjector");
var Objects = require("rauricoste-objects");

var Meta = require("../../alias/Meta");

var UnitType = require("./UnitType");
var God = require("./God");
var GodCard = require("./GodCard");
var Battle = require("./Battle");
var Territory = require("./Territory");
var Bid = require("./Bid");
var Unit = require("./Unit");

var logger = require("../../alias/Logger").getLogger("Player");

var PlayerWithDeps = injector.register("Player", ["randomReaderAsync"], function(randomReaderAsync) {

  var Player = Meta.declareClass("Player", {
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
      _defaults: {
        unitBuyCount: 0,
        cardBuyCount: 0,
        cards: {},
        gladiatorMoveCount: 0,
        lastIncome: 0,
        templeUsed: 0,
        initBuildCount: 0,
        gold: 7,
        unitsLeft: {
            earth: 8,
            sea: 8,
            gladiator: 3
        }
      },
      _init: function () {
          if (!this.initCount) {
              this.initCount = {};
              for (var name in UnitType._all) {
                  this.initCount[name] = 0;
              }
          }
      },
      buyUnit: function (territory) {
          var self = this;
          try {
              this.requireGod();
              if (!this.god.unitType) {
                  throw new Error("ce dieu ne peut pas vous fournir d'unité.");
              }
              var price = this.god.unitPrice()[this.unitBuyCount];
              if (!price && price !== 0) {
                  throw new Error("il n'y a plus d'unité à acheter.");
              }
              var territoryType = this.god.unitType.territoryType;
              if (territoryType !== territory.type) {
                  throw new Error("il est impossible de placer ce type d\'unité sur ce type de territoire.");
              }
              if (territory.owner !== this && territory.type === "earth") {
                  throw new Error("vous ne pouvez acheter des unités terrestres que sur des territoires que vous contrôlez");
              }
              if (!territory.isFriendly(self) && territory.type === "sea") {
                  throw new Error("vous ne pouvez acheter des unités maritimes que sur des territoires vides ou que vous contrôlez");
              }
              var nearbyOwnedTerritories = territory.getNeighbours().filter(function(territory2) {
                return territory2.type === "earth" && territory2.owner === self;
              });
              if (territory.type === "sea" && !nearbyOwnedTerritories.length) {
                  throw new Error("vous ne pouvez acheter des unités maritimes que sur des territoires situés à proximité d'un territoire terrestre que vous contrôlez");
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
          return this.copy({gold: this.gold - number})
      },
      requireGod: function () {
          if (!this.god) {
              throw new Error("vous n'avez sélectionné aucun dieu.");
          }
      },
      addGodCard: function (card) {
          var self = this.copy({cards: Objects.copy(this.cards)});
          var currentValue = this.cards[card.name];
          if (!currentValue) {
              self.cards[card.name] = 0;
          }
          self.cards[card.name]++;
          return self;
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
      buyCreature: function(cost, templeUsed) {
        return this.spend(cost).copy({
          templeUsed: this.templeUsed + templeUsed
        });
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
      payBid: function(amount) {
          var goldLeft = amount - this.getPriests();
          var payment = Math.max(1, goldLeft);
          return this.spend(payment);
      },
      findPathBySea: function(fromTerritory, toTerritorry, currentPath, passedTerritories) {
        var self = this;
        passedTerritories = passedTerritories ? passedTerritories : [];
        currentPath = currentPath ? currentPath : [];
        if (fromTerritory.isNextTo(toTerritorry)) {
          return currentPath.concat([toTerritorry]);
        }
        var neighbourIdsLeft = fromTerritory.neighbours.diff(passedTerritories);
        if (neighbourIdsLeft.length === 0) {
          return null;
        }
        var possibleNeighbours = neighbourIdsLeft.map(function(id) {
          return Territory.byId(id);
        }).filter(function(territory) {
          return territory && territory.type === "sea" && territory.owner === self;
        });
        passedTerritories.push(fromTerritory.id);
        logger.debug("passed territories", passedTerritories);
        return possibleNeighbours.find(function(territory) {
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
          var allInTerritory = units.every(function(unit) {
            return fromTerritory.units.indexOf(unit) !== -1;
          });
          if (!allInTerritory) {
            throw new Error("toutes les unités doivent partir du même territoire et arriver sur le même territoire");
          }
          this.requireGod();
          if (!this.findPathBySea(fromTerritory, toTerritorry)) {
              throw new Error("le territoire de destination n'est pas adjacent au territoire de départ, ou relié par une chaîne de bateaux.");
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
          fromTerritory.moveUnits(units, toTerritorry);
          if (toTerritorry.hasConflict()) {
            return self.generateBattle(toTerritorry);
          } else {
            toTerritorry.owner = self;
          }
      },
      generateBattle: function(territory) {
          return randomReaderAsync.nextNRandoms(2).then(function (randoms) {
              var battle = Battle.new(randoms, territory);
              logger.debug("battle", battle);
              return battle;
          });
      },
      resolveBattle: function(battle, options) {
          if (options.unit) {
            logger.info("resolveBattle : removing unit");
            battle.territory.removeUnit(options.unit);
            battle.getState(this).setLoss(options.unit);
          }
          if (options.retreatTerritory) {
            logger.info("resolveBattle : retreating...");
            this.retreat(battle.territory, options.retreatTerritory);
            battle.getState(this).retreat();
          }
          if (options.stay) {
            battle.getState(this).stay();
          }
          logger.info("battle fully resolved", battle.isFullyResolved());
          if (battle.isFullyResolved()) {
            if (battle.territory.hasConflict()) {
              logger.info("no retreats, generating new battle");
              return this.generateBattle(battle.territory);
            } else {
              var units = battle.territory.units;
              if (units.length) {
                battle.territory.owner = units[0].owner;
              }
              logger.info("battle is over");
              return true; // battle is over
            }
          }
      },
      possibleRetreats: function (territory) {
          var self = this;
          return Territory.allArray().filter(function(territory2) {
            return territory2.isFriendly(self) && (territory.isNextTo(territory2) || !!self.findPathBySea(territory, territory2));
          });
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
  return Player;
});

module.exports = PlayerWithDeps;
