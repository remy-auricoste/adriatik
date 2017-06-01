var Objects = require("rauricoste-objects"); // polyfill

var rauriArrays = require("rauricoste-arrays");
var Arrays = require("../natif/Arrays");
var Errors = require("../natif/Errors");

var injector = require("../../core/MyInjector");

var Meta = require("../../alias/Meta");
var Phases = require("./Phases");
var CreatureCard = require("./CreatureCard");
var UnitType = require("./UnitType");
var Unit = require("./Unit");
var Building = require("./Building");
var God = require("./God");

var q = require("../../services/qPlus");
var config = require("../../services/config");
var logger = require("../../alias/Logger").getLogger("Game");

var GameWithDeps = injector.register("Game", ["randomReaderAsync"], function(randomReaderAsync) {
  var Game = Meta.declareClass("Game", {
      territories: ["Territory"],
      gods: ["God"],
      currentGods: ["God"],
      players: ["Player"],
      creatures: ["CreatureCard"],
      creaturesUsed: ["CreatureCard"],
      creaturesLeft: ["CreatureCard"],
      currentPlayer: "Player",
      turn: 1,
      phase: "",
      colors: [],
      warMode: true,
      currentBattle: "Battle",
      _mandatoryFields: [
        "players"
      ],
      _defaults: {
        gods: [],
        currentGods: [],
        turn: 0,
        phase: Phases.bidding,
        territories: [],
        colors: ["red", "blue", "green", "purple"],
        creatures: [],
        creaturesUsed: [],
        creaturesLeft: Object.values(CreatureCard._all),
        currentPlayerIndex: 0,
        bids: []
      },
      _init: function () {
          var self = this;
          this.players.map(function (player, index) {
              player.color = self.colors[index];
          });
      },
      getCurrentPlayer: function() {
        return this.players[this.currentPlayerIndex];
      },
      startTurn: function () {
          var self = this.copy({
            turn: this.turn+1,
            bids: []
          });
          var normalGods = self.gods.filter(function (god) {
              return god !== God.Ceres;
          });
          var godPromise = randomReaderAsync.shuffle(normalGods).then(function (shuffled) {
              shuffled = shuffled.slice(0, self.players.length - 1);
              shuffled.push(God.Ceres);
              self.currentGods = shuffled;
          });
          var playersPromise = q.empty();
          if (self.turn === 1) {
              playersPromise = randomReaderAsync.shuffle(self.players).then(function(players) {
                self.players = players;
                self.currentPlayerIndex = 0;
              });
          } else {
              self.players.forEach(function(player) {
                var income = self.getIncome(player);
                player.lastIncome = income;
                player.gold += income;
              })
          }
          var creaturesPromise = self.turn === 1 ? q.empty() : self.pushCreatures(self.turn === 2 ? 1 : 3);
          return q.all([godPromise, playersPromise, creaturesPromise]).then(function() {
            return self;
          });
      },
      endPlayerTurn: function () {
          var self = this.copy();
          if (self.phase === Phases.bidding) {
              var freePlayers = self.players.filter(function(player) {
                  return !self.getPlayerBid(player);
              });
              if (freePlayers.length) {
                  self.currentPlayerIndex = self.players.indexOf(freePlayers[0]);
                  return self;
              } else {
                  return self.nextPhase();
              }
          } else if (self.phase === Phases.actions) {
              self.currentPlayerIndex++;
              if (self.currentPlayerIndex >= self.players.length) {
                  return self.nextPhase();
              }
              return self;
          }
      },
      getBidsForGod: function(god) {
          return this.bids.filter(function(bid) {
            return bid.god === god.name;
          });
      },
      getPlayerBid: function(player) {
          return this.bids.find(function(bid) {
            return bid.player === player.name;
          })
      },
      getPlayerByName: function(playerName) {
        return this.players.find(function(player) {
          return player.name === playerName;
        })
      },
      getPlayerGod: function(player) {
        var bid = this.getPlayerBid(player);
        var godName = bid && bid.god;
        return God._all[godName];
      },
      addBid: function(player, god, amount) {
        this.bids = this.bids.filter(function(bid) {
          return bid.player !== player.name;
        }).concat([{
          player: player.name,
          god: god.name,
          amount: amount
        }])
        return this;
      },
      removeBid: function(bid) {
        var index = this.bids.indexOf(bid);
        if (index >= 0) {
          this.bids.splice(index, 1);
        }
      },
      placeBid: function (player, god, amount) {
          try {
            player = this.getPlayerByName(player.name);
            if (god === God.Ceres) {
                var self = this.copy();
                self.addBid(player, god, 0);
                return self.endPlayerTurn();
            }
            if (amount > player.gold + player.getPriests()) {
                throw new Error("vous n'avez pas assez de sesterces.");
            }
            var previousBids = this.getBidsForGod(god);
            if (previousBids.length) {
              if (previousBids.length > 1) {
                throw new Error("weird state : several bids on the same god")
              }
              var lastPreviousBid = previousBids[previousBids.length - 1];
              if (amount <= lastPreviousBid.amount) {
                  throw new Error("votre enchère n'est pas assez importante.");
              }
              if (previousBids.find(function(bid) {
                return bid.player === player.name;
              })) {
                  throw new Error("il est mpossible de surenchérir sur le même dieu.");
              }
              var self = this.copy();
              self.addBid(player, god, amount);
              var previousBid = previousBids[0];
              self.removeBid(previousBid);
              var previousBidderIndex = self.players.findIndex(function(player) {
                return player.name === previousBid.player;
              })
              self.currentPlayerIndex = previousBidderIndex;
              return self;
            } else {
              var self = this.copy();
              self.addBid(player, god, amount);
              return self.endPlayerTurn();
            }
          } catch(err) {
            throw err.prefix("Il est impossible de placer cette enchère : ");
          }
      },
      nextPhase: function () {
          var self = this.copy();
          if (self.phase === Phases.bidding) {
              self.phase = Phases.actions;
              self.players = self.players.map(function(player) {
                var bid = self.getPlayerBid(player);
                return player.payBid(bid.amount);
              });
              self.players = rauriArrays.flatMap(self.currentGods, function(god) {
                return self.getBidsForGod(god).map(function(bid) {
                  return self.getPlayerByName(bid.player);
                })
              })
              self.currentPlayerIndex = 0;
              return self;
          } else if (self.phase === Phases.actions) {
              self.currentPlayerIndex = 0;
              self.phase = Phases.bidding;
//              self.players.map(function (player) {
//                  return player.reset();
//              });
              return self.startTurn();
          }
      },
      resolveBattle: function(player, battle, options) {
          var result = player.resolveBattle(battle, options);
          if (result === true) {
            this.currentBattle = null;
          } else if(result) {
            return result.then(function(battle) {
              logger.info("setting new battle", battle);
              this.currentBattle = battle;
              return battle;
            });
          }
      },
      initUnit: function (playerName, territoryIndex) {
          var player = this.getPlayerByName(playerName);
          var territory = this.getTerritory(territoryIndex);
          if (this.turn !== 1) {
              throw new Error("dev error: you cannot use this method if it is not turn 1.");
          }
          try {
              if (territory.owner && territory.owner !== player.name) {
                  throw new Error("vous devez contrôler le territoire ou le territoire doit être neutre.");
              }
              var playerTerritories = this.getTerritoriesForPlayer(playerName);
              if (!territory.owner) {
                  if (territory.type === "sea") {
                    var isAdjacentEarth = playerTerritories.some(function(territoryIte) {
                      return territoryIte.type === "earth";
                    });
                    if (!isAdjacentEarth) {
                      throw new Error("vous devez placer vos bateaux sur des territoires adjacents à vos territoires terrestres");
                    }
                  }
                  if (this.warMode) {
                    var sameTypeTerritories = playerTerritories.filter(function (territoryIte) {
                        return territory.type === territoryIte.type;
                    });
                    if (sameTypeTerritories.length === 2) {
                        throw new Error("vous devez prendre 2 territoires terrestres et 2 territoires maritimes contigus.");
                    }
                    var isAdjacent = playerTerritories.some(function (territoryIte) {
                        return territoryIte.isNextTo(territory);
                    });
                    if (playerTerritories.length && !isAdjacent) {
                        throw new Error("il n'est pas adjacent aux territoires déjà contrôlés.");
                    }
                  }
              }
              var unitType = territory.type === "earth" ? UnitType.Legionnaire : UnitType.Ship;
              var currentValue = playerTerritories.map(function(territory) {
                return territory.getUnits(player).length;
              }).sum();
              var playerGod = this.getPlayerGod(player);
              var allowedValue = 2 + (playerGod.unitType && playerGod.unitType === unitType ? 1 : 0);
              if (currentValue === allowedValue) {
                  throw new Error("vous ne pouvez pas ajouter d'autres unités de type " + unitType.name + ".");
              }
              if (currentValue === allowedValue - 1 && territory.owner === player.name) {
                  throw new Error("vous devez prendre 2 territoires terrestres et 2 territoires maritimes contigus.");
              }
              var unit = new Unit({
                  type: unitType,
                  owner: player.name
              });
              territory = territory.placeUnit(unit).copy({owner: player.name});
              return this.updateTerritory(territory);
          } catch (err) {
              throw err.prefix("Il est impossible de placer une unité sur ce territoire : ");
          }
      },
      initHasMoreUnits: function (player) {
          var unitCount = 0;
          for (var key in player.initCount) {
              var value = player.initCount[key];
              unitCount += value;
          }
          var allowedValue = 4 + (player.god.unitType ? 1 : 0);
          if (player.god === God.Pluton && God.Pluton.index === 0) {
              allowedValue++;
          }
          return unitCount < allowedValue;
      },
      getTerritoriesForPlayer: function(playerName) {
        return this.territories.filter(function(territory) {
          return territory.owner === playerName;
        });
      },
      getTemples: function(playerName) {
        return this.getTerritoriesForPlayer(playerName).map(function(territory) {
          return territory.buildings.filter(function(building) {
            return building === Building.Temple || building === Building.Cite;
          }).length;
        }).sum();
      },
      buyCreature: function(playerName, creature, args) {
        var index = this.creatures.indexOf(creature);
        if (index >= 0) {
          var cost = [4, 3, 2][index];
          var temples = this.getTemples(playerName);
          var player = this.getPlayerByName(playerName);
          var discount = temples - player.templeUsed;
          var finalCost = Math.max(1, cost - discount);
          var discountUsed = cost - finalCost;
          // TODO handle immutability here
          creature.apply(this, player, args);
          var newPlayer = player.buyCreature(finalCost, discountUsed);
          var self = this.updatePlayer(newPlayer);
          self.creatures[index] = null;
          return self;
        } else {
          throw new Error("could not find creature "+creature.name);
        }
      },
      pushCreatures: function(count) {
        if (!count) {
          count = 3;
        }
        var self = this;
        this.creatures[2] = null;
        this.creatures = this.creatures.filter(function(creature) {
          return creature;
        });
        return randomReaderAsync.shuffle(self.creaturesLeft).then(function() {
          var missingCard = count - self.creatures.length;
          self.creatures = self.creaturesLeft.slice(0, missingCard).concat(self.creatures);
        });
      },
      getIncome: function(player) {
        return this.getTerritoriesForPlayer(player.name).map(function(territory) {
          return territory.getIncome();
        }).sum();
      },
      updateTerritory: function(territory) {
        var index = territory.index;
        var self = this.copy();
        self.territories = this.territories.concat([]);
        self.territories[index] = territory;
        return self;
      },
      updatePlayer: function(newPlayer) {
        var self = this.copy();
        var index = this.players.findIndex(function(playerIte) {
          return playerIte.name === newPlayer.name;
        })
        self.players[index] = newPlayer;
        return self;
      },
      getTerritory: function(index) {
        return this.territories[index];
      },
      build: function(playerName, territoryIndex, building) {
        var player = this.getPlayerByName(playerName);
        var territory = this.getTerritory(territoryIndex);
        var god = this.getPlayerGod(player);
        try {
            if (!god) {
              throw new Error("vous n\'avez sélectionné aucun dieu.");
            }
            if (!god.building) {
                throw new Error("ce dieu ne peut pas construire ce tour-ci.");
            }
            territory = territory.build(building);
            player = player.spend(2);
            return this.updateTerritory(territory).updatePlayer(player);
        } catch (err) {
            throw err.prefix("Il est impossible de construire : ");
        }
      }
  });
  return Game;
})
