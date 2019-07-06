module.exports = class Game {
  constructor({ turn = 1, territories = [], warMode = false } = {}) {
    this.turn = turn;
    this.territories = territories;
    this.warMode = warMode;
  }
  //writes
  update(entity) {
    return this.copy({
      territories: this.territories
        .filter(territory => territory.id !== entity.id)
        .concat([entity])
    });
  }
  copy(params = {}) {
    return new Game(Object.assign({}, this, params));
  }
  //reads
  getTerritoriesForPlayer(player) {
    return this.territories.filter(territory => {
      return territory.isOwner(player);
    });
  }
  getEntityById(id) {
    return this.territories.find(entity => entity.id === id);
  }
  getEntity(entity) {
    return this.getEntityById(entity.id);
  }
};

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
//
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
//   getIncome(player) {
//     return this.getTerritoriesForPlayer(player.name).map(function(territory) {
//       return territory.getIncome();
//     }).sum();
//   },

// };
