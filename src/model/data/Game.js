var Arrays = require("../natif/Arrays");

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
      _defaults: {
        gods: [],
        turn: 0,
        phase: Phases.bidding,
        territories: [],
        colors: ["red", "blue", "green", "purple"],
        creatures: [],
        creaturesUsed: [],
        creaturesLeft: Object.values(CreatureCard._all)
      },
      _init: function () {
          var self = this;
          if (!this.currentPlayer) {
              this.currentPlayer = this.players[0];
          }
          this.players.map(function (player, index) {
              player.color = self.colors[index];
          });
      },
      startTurn: function () {
          var self = this;

          self.turn++;
          var normalGods = self.gods.filter(function (god) {
              return god !== God.Ceres;
          });
          var godPromise = randomReaderAsync.shuffle(normalGods).then(function (shuffled) {
              shuffled = shuffled.slice(0, self.players.length - 1);
              shuffled.push(God.Ceres);
              self.currentGods = shuffled;
              shuffled.map(function (god, index) {
                  god.index = index;
              })
          });
          var playersPromise = q.empty();
          self.syncing = true;
          if (self.turn === 1) {
              playersPromise = randomReaderAsync.shuffle(self.players).then(function() {
                self.currentPlayer = self.players[0];
              });
          } else {
              self.players.forEach(function(player) {
                var income = self.getIncome(player);
                player.lastIncome = income;
                player.gold += income;
              })
          }
          var creaturesPromise = this.turn === 1 ? q.empty() : self.pushCreatures(this.turn === 2 ? 1 : 3);
          return q.all([godPromise, playersPromise, creaturesPromise]).then(function(result) {
            self.syncing = false;
            return result;
          });
      },
      endPlayerTurn: function () {
          var self = this;
          if (self.phase === Phases.bidding) {
              var freePlayers = self.players.filter(function (player) {
                  return !player.bid;
              });
              if (freePlayers.length) {
                  self.currentPlayer = freePlayers[0];
              } else {
                  return self.nextPhase();
              }
          } else if (self.phase === Phases.actions) {
              var index = self.players.findIndex(function (player) {
                  return player === self.currentPlayer;
              });
              if (index < 0) {
                  throw new Error("Il est impossible de trouver le joueur.");
              }
              index++;
              if (index >= self.players.length) {
                  return self.nextPhase();
              } else {
                  self.currentPlayer = self.players[index];
              }
          }
      },
      getPlayer: function (god) {
          var biddingPlayers = this.players.filter(function (player) {
              return player.bid && player.bid.godName === god.name;
          });
          biddingPlayers.sort(function (a, b) {
              return b.bid.gold - a.bid.gold;
          });
          return biddingPlayers[0];
      },
      placeBid: function (player, god, amount) {
          if (god === God.Ceres) {
              player.placeBid(god, 0);
              return this.endPlayerTurn();
          }
          var removedPlayer = this.getPlayer(god);
          player.placeBid(god, amount);
          if (removedPlayer) {
              this.currentPlayer = removedPlayer;
              return removedPlayer;
          } else {
              return this.endPlayerTurn();
          }
      },
      nextPhase: function () {
          var self = this;

          if (self.phase === Phases.bidding) {
              self.phase = Phases.actions;

              var CeresPlayers = God.Ceres.playerNames.map(function (name) {
                  return self.players.find(function (player) {
                      return player.name === name;
                  });
              });
              self.players = self.currentGods.filter(function (god) {
                  return god.bid && god !== God.Ceres;
              }).map(function (god) {
                  return self.getPlayer(god);
              });
              self.players = self.players.concat(CeresPlayers);
              self.players.map(function (player) {
                  player.payBid();
              });
              self.currentPlayer = self.players[0];
          } else if (self.phase === Phases.actions) {
              self.currentPlayer = self.players[0];
              self.phase = Phases.bidding;

              self.players.map(function (player) {
                  player.bid = null;
                  player.god = null;
                  player.templeUsed = 0;
                  player.unitBuyCount = 0;
                  player.cardBuyCount = 0;
              });
              self.gods.map(function(god) {
                god.bid = null;
              });
              God.Ceres.playerNames = [];

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
  //    receiveCommand: function (command) {
  //        var self = this;
  //        if (!config.isDev() && !(command.player && command.player === this.currentPlayer)) {
  //            throw new Error("received command not from currentPlayer" + JSON.stringify(command));
  //        }
  //        var commandNames = Object.keys(CommandType._all);
  //        if (commandNames.indexOf(command.type.name) === -1) {
  //            throw new Error("Type de commande inconnu " + command.type.name + ".");
  //        }
  //        if (command.type.argCount !== command.args.length) {
  //            throw new Error("got " + command.args.length + " args but needed " + command.type.argCount + " args.");
  //        }
  //        var commandResult;
  //        if (command.type === CommandType.Bid) {
  //            commandResult = this.placeBid(this.currentPlayer, command.args[0], command.args[1]);
  //        } else if (command.type === CommandType.InitUnit) {
  //            commandResult = this.initUnit(this.currentPlayer, command.args[0]);
  //        } else if (command.type === CommandType.BuyCreature) {
  //            commandResult = this.buyCreature(this.currentPlayer, command.args[0], command.args[1]);
  //        } else if (command.type === CommandType.EndTurn) {
  //            commandResult = this.endPlayerTurn();
  //        } else if (command.type === CommandType.ResolveBattle) {
  //            commandResult = this.resolveBattle(command.player, command.args[0], command.args[1])
  //        } else {
  //            commandResult = this.currentPlayer[command.type.methodName](command.args[0], command.args[1], command.args[2]);
  //        }
  //        if (commandResult && typeof commandResult.then === "function") {
  //            this.syncing = true;
  //            commandResult = commandResult.then(function(result) {
  //                if (result._type === "Battle") {
  //                  self.currentBattle = result;
  //                }
  //                self.syncing = false;
  //                return result;
  //            });
  //        }
  //        return commandResult;
  //    },
      initUnit: function (player, territory) {
          if (this.turn !== 1) {
              throw new Error("dev error: you cannot use this method if it is not turn 1.");
          }
          try {
              if (territory.owner && territory.owner !== player) {
                  throw new Error("vous devez contrôler le territoire ou le territoire doit être neutre.");
              }
              if (!territory.owner) {
                  var playerTerritories = this.territories.filter(function (territory) {
                      return territory.owner === player;
                  });
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
                        return territoryIte.neighbours.indexOf(territory.id) !== -1;
                    });
                    if (playerTerritories.length && !isAdjacent) {
                        throw new Error("il n'est pas adjacent aux territoires déjà contrôlés.");
                    }
                  }
              }
              var self = player;
              var unitType = territory.type === "earth" ? UnitType.Legionnaire : UnitType.Ship;
              var currentValue = player.initCount[unitType.name];
              var allowedValue = 2 + (player.god.unitType && player.god.unitType === unitType ? 1 : 0);
              if (currentValue === allowedValue) {
                  throw new Error("vous ne pouvez pas ajouter d'autres unités de type " + unitType.name + ".");
              }
              if (currentValue === allowedValue - 1 && territory.owner === player) {
                  throw new Error("vous devez prendre 2 territoires terrestres et 2 territoires maritimes contigus.");
              }
              player.initCount[unitType.name] = currentValue + 1;
              var unit = new Unit({
                  type: unitType,
                  owner: self
              });
              territory.owner = player;
              territory.placeUnit(unit);
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
      getTemples: function(player) {
        return this.territories.filter(function(territory) {
          return territory.owner === player;
        }).map(function(territory) {
          return territory.buildings.filter(function(building) {
            return building === Building.Temple || building === Building.Cite;
          }).length;
        }).sum();
      },
      buyCreature: function(player, creature, args) {
        var self = this;
        var index = this.creatures.indexOf(creature);
        if (index >= 0) {
          var cost = [4, 3, 2][index];
          var discount = this.getTemples(player) - player.templeUsed;
          var finalCost = Math.max(1, cost - discount);
          var discountUsed = cost - finalCost;
          player.spend(finalCost);
          try {
            creature.apply(self, player, args);
          } catch(err) {
            player.gold += finalCost;
            throw err;
          }
          player.templeUsed += discountUsed;
          this.creatures[index] = null;
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
        return this.territories.filter(function(territory) {
          return territory.owner === player;
        }).map(function(territory) {
          return territory.getIncome();
        }).sum();
      }
  });
  return Game;
})
