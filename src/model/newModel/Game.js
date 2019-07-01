// module.exports = class Game {
//   constructor({ gameSettings } = {}) {
//     this.init()
//   }
//   // writes
//   init() {
//       const {players} = this
//     return randomReaderAsync.shuffle(players).then(newPlayers => {
//         this.players = newPlayers
//         this.currentPlayerIndex = 0
//       });
//   }
//   startTurn() {
//       const {turn, players, gods} = this
//       const self = this.copy({
//         turn: this.turn+1,
//         bids: []
//       });
//       const normalGods = gods.filter(god => {
//           return god !== God.Ceres;
//       });
//       const godPromise = randomReaderAsync.shuffle(normalGods).then(function (shuffled) {
//           shuffled = shuffled.slice(0, players.length - 1);
//           shuffled.push(God.Ceres);
//           return shuffled
//       });
//       if (self.turn !== 1) {
//           const newPlayers = players.map(player => {
//             const income = this.getIncome(player);
//             return player.income(income)
//           })
//       }
//       const creaturesPromise = self.turn === 1 ? Promise.empty() : this.pushCreatures(turn === 2 ? 1 : 3);
//       return Promise.all([godPromise, playersPromise, creaturesPromise]).then(function() {
//         return self;
//       });
//   }
//   endPlayerTurn() {
//       const {phase, players} = this
//       const self = this.copy();
//       if (phase === Phases.bidding) {
//           const freePlayers = players.filter(player => {
//               return !this.getPlayerBid(player);
//           });
//           if (freePlayers.length) {
//               this.currentPlayerIndex = players.indexOf(freePlayers[0]);
//               return self;
//           } else {
//               return self.nextPhase();
//           }
//       } else if (phase === Phases.actions) {
//           self.currentPlayerIndex++;
//           if (self.currentPlayerIndex >= players.length) {
//               return self.nextPhase();
//           }
//           return self;
//       }
//   }

//   // reads
//   getCurrentPlayer() {
//     return this.players[this.currentPlayerIndex];
//   }

//   getPlayerByName(playerName) {
//     return this.players.find(function(player) {
//       return player.name === playerName;
//     })
//   },
//   getPlayerGod(player) {
//     const bid = this.getPlayerBid(player);
//     const godName = bid && bid.god;
//     return God._all[godName];
//   },

//   nextPhase() {
//       const self = this.copy();
//       if (self.phase === Phases.bidding) {
//           self.phase = Phases.actions;
//           self.players = self.players.map(function(player) {
//             const bid = self.getPlayerBid(player);
//             return player.payBid(bid.amount);
//           });
//           self.players = rauriArrays.flatMap(self.currentGods, function(god) {
//             return self.getBidsForGod(god).map(function(bid) {
//               return self.getPlayerByName(bid.player);
//             })
//           })
//           self.currentPlayerIndex = 0;
//           return self;
//       } else if (self.phase === Phases.actions) {
//           self.currentPlayerIndex = 0;
//           self.phase = Phases.bidding;
// //              self.players.map(function (player) {
// //                  return player.reset();
// //              });
//           return self.startTurn();
//       }
//   },
//   resolveBattle(player, battle, options) {
//       const result = player.resolveBattle(battle, options);
//       if (result === true) {
//         this.currentBattle = null;
//       } else if(result) {
//         return result.then(function(battle) {
//           logger.info("setting new battle", battle);
//           this.currentBattle = battle;
//           return battle;
//         });
//       }
//   },
//   initUnit(playerName, territoryIndex) {
//       const player = this.getPlayerByName(playerName);
//       const territory = this.getTerritory(territoryIndex);
//       if (this.turn !== 1) {
//           throw new Error("dev error: you cannot use this method if it is not turn 1.");
//       }
//       try {
//           if (territory.owner && territory.owner !== player.name) {
//               throw new Error("vous devez contrôler le territoire ou le territoire doit être neutre.");
//           }
//           const playerTerritories = this.getTerritoriesForPlayer(playerName);
//           if (!territory.owner) {
//               if (territory.type === "sea") {
//                 const isAdjacentEarth = playerTerritories.some(function(territoryIte) {
//                   return territoryIte.type === "earth";
//                 });
//                 if (!isAdjacentEarth) {
//                   throw new Error("vous devez placer vos bateaux sur des territoires adjacents à vos territoires terrestres");
//                 }
//               }
//               if (this.warMode) {
//                 const sameTypeTerritories = playerTerritories.filter(function (territoryIte) {
//                     return territory.type === territoryIte.type;
//                 });
//                 if (sameTypeTerritories.length === 2) {
//                     throw new Error("vous devez prendre 2 territoires terrestres et 2 territoires maritimes contigus.");
//                 }
//                 const isAdjacent = playerTerritories.some(function (territoryIte) {
//                     return territoryIte.isNextTo(territory);
//                 });
//                 if (playerTerritories.length && !isAdjacent) {
//                     throw new Error("il n'est pas adjacent aux territoires déjà contrôlés.");
//                 }
//               }
//           }
//           const unitType = territory.type === "earth" ? UnitType.Legionnaire : UnitType.Ship;
//           const currentValue = playerTerritories.map(function(territory) {
//             return territory.getUnitsOfType(player, unitType).length;
//           }).sum();
//           const playerGod = this.getPlayerGod(player);
//           const allowedValue = 2 + (playerGod.unitType && playerGod.unitType === unitType ? 1 : 0);
//           if (currentValue === allowedValue) {
//               throw new Error("vous ne pouvez pas ajouter d'autres unités de type " + unitType.name + ".");
//           }
//           if (currentValue === allowedValue - 1 && territory.owner === player.name) {
//               throw new Error("vous devez prendre 2 territoires terrestres et 2 territoires maritimes contigus.");
//           }
//           const unit = new Unit({
//               type: unitType,
//               owner: player.name
//           });
//           territory = territory.placeUnit(unit).copy({owner: player.name});
//           return this.updateTerritory(territory);
//       } catch (err) {
//           throw err.prefix("Il est impossible de placer une unité sur ce territoire : ");
//       }
//   },
//   initHasMoreUnits(player) {
//       const unitCount = 0;
//       for (const key in player.initCount) {
//           const value = player.initCount[key];
//           unitCount += value;
//       }
//       const allowedValue = 4 + (player.god.unitType ? 1 : 0);
//       if (player.god === God.Pluton && God.Pluton.index === 0) {
//           allowedValue++;
//       }
//       return unitCount < allowedValue;
//   },
//   getTerritoriesForPlayer(playerName) {
//     return this.territories.filter(function(territory) {
//       return territory.owner === playerName;
//     });
//   },
//   getTemples(playerName) {
//     return this.getTerritoriesForPlayer(playerName).map(function(territory) {
//       return territory.buildings.filter(function(building) {
//         return building === Building.Temple || building === Building.Cite;
//       }).length;
//     }).sum();
//   },
//   buyCreature(playerName, creature, args) {
//     const index = this.creatures.indexOf(creature);
//     if (index >= 0) {
//       const cost = [4, 3, 2][index];
//       const temples = this.getTemples(playerName);
//       const player = this.getPlayerByName(playerName);
//       const discount = temples - player.templeUsed;
//       const finalCost = Math.max(1, cost - discount);
//       const discountUsed = cost - finalCost;
//       // TODO handle immutability here
//       creature.apply(this, player, args);
//       const newPlayer = player.buyCreature(finalCost, discountUsed);
//       const self = this.updatePlayer(newPlayer);
//       self.creatures[index] = null;
//       return self;
//     } else {
//       throw new Error("could not find creature "+creature.name);
//     }
//   },
//   pushCreatures(count) {
//     if (!count) {
//       count = 3;
//     }
//     const self = this;
//     this.creatures[2] = null;
//     this.creatures = this.creatures.filter(function(creature) {
//       return creature;
//     });
//     return randomReaderAsync.shuffle(self.creaturesLeft).then(function() {
//       const missingCard = count - self.creatures.length;
//       self.creatures = self.creaturesLeft.slice(0, missingCard).concat(self.creatures);
//     });
//   },
//   getIncome(player) {
//     return this.getTerritoriesForPlayer(player.name).map(function(territory) {
//       return territory.getIncome();
//     }).sum();
//   },
//   updateTerritory(territory) {
//     const index = territory.index;
//     const self = this.copy();
//     self.territories = this.territories.concat([]);
//     self.territories[index] = territory;
//     return self;
//   },
//   updatePlayer(newPlayer) {
//     const self = this.copy();
//     const index = this.players.findIndex(function(playerIte) {
//       return playerIte.name === newPlayer.name;
//     })
//     self.players[index] = newPlayer;
//     return self;
//   },
//   getTerritory(index) {
//     return this.territories[index];
//   },
//   getNeighboursTerritories(territory) {
//     return territory.neighbours.map(index => this.getTerritory(index));
//   },
//   build(playerName, territoryIndex, building) {
//     const player = this.getPlayerByName(playerName);
//     const territory = this.getTerritory(territoryIndex);
//     const god = this.getPlayerGod(player);
//     try {
//         if (!god) {
//           throw new Error("vous n\'avez sélectionné aucun dieu.");
//         }
//         if (!god.building) {
//             throw new Error("ce dieu ne peut pas construire ce tour-ci.");
//         }
//         territory = territory.build(building);
//         player = player.spend(2);
//         return this.updateTerritory(territory).updatePlayer(player);
//     } catch (err) {
//         throw err.prefix("Il est impossible de construire : ");
//     }
//   },
//   buyUnit(territory) {
//     try {
//         const player = this.getCurrentPlayer();
//         const playerName = player.name;
//         const god = this.getPlayerGod(player);
//         if (!god) {
//             throw new Error("aucun dieu disponible");
//         }
//         if (!god.unitType) {
//             throw new Error("ce dieu ne peut pas vous fournir d'unité.");
//         }
//         const price = god.unitPrice()[player.unitBuyCount];
//         if (!price && price !== 0) {
//             throw new Error("il n'y a plus d'unité à acheter.");
//         }
//         const territoryType = god.unitType.territoryType;
//         if (territoryType !== territory.type) {
//             throw new Error("il est impossible de placer ce type d\'unité sur ce type de territoire.");
//         }
//         if (territory.owner !== playerName && territory.type === "earth") {
//             throw new Error("vous ne pouvez acheter des unités terrestres que sur des territoires que vous contrôlez");
//         }
//         if (!territory.isFriendly(self) && territory.type === "sea") {
//             throw new Error("vous ne pouvez acheter des unités maritimes que sur des territoires vides ou que vous contrôlez");
//         }
//         const nearbyOwnedTerritories = this.getNeighboursTerritories(territory).filter(function(territory2) {
//           return territory2.type === "earth" && territory2.owner === playerName;
//         });
//         if (territory.type === "sea" && !nearbyOwnedTerritories.length) {
//             throw new Error("vous ne pouvez acheter des unités maritimes que sur des territoires situés à proximité d'un territoire terrestre que vous contrôlez");
//         }
//         player = player.spend(price);
//         territory = territory.placeUnit(new Unit({type: god.unitType, owner: playerName}));
//         player.unitBuyCount++;
//         return this.updateTerritory(territory).updatePlayer(player);
//     } catch (err) {
//         throw err.prefix("Il est impossible d'acheter une unité : ")
//     }
//   }
// };
