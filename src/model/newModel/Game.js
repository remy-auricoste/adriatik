module.exports = function(
  CreatureCard,
  CreatureMarket,
  GameSettings,
  BidsState,
  PhaseBid,
  PhaseAction,
  randomReaderAsync
) {
  return class Game {
    constructor({
      turn = 1,
      territories = [],
      players = [],
      creatureMarket = new CreatureMarket({
        creaturesDraw: CreatureCard.all
      }),
      gods = [],
      settings = new GameSettings(),
      bidState = new BidsState(),
      currentPlayerIndex = 0,
      phases = [new PhaseBid(), new PhaseAction()],
      currentPhaseIndex = 0
    } = {}) {
      this.turn = turn;
      this.territories = territories;
      this.players = players;
      this.creatureMarket = creatureMarket;
      this.gods = gods;
      this.settings = settings;
      this.bidState = bidState;
      this.currentPlayerIndex = currentPlayerIndex;
      this.phases = phases;
      this.currentPhaseIndex = currentPhaseIndex;
    }
    //writes
    update(entity) {
      return this.copy({
        territories: this.territories
          .filter(territory => territory.id !== entity.id)
          .concat([entity])
      });
    }
    async start() {
      const game = this;
      const { players } = game;
      return await game
        .copy({
          players: randomReaderAsync.shuffle(players)
        })
        .getCurrentPhase()
        .start({ game });
    }
    async nextPhase(game = this) {
      const { currentPhaseIndex, phases } = game;
      const currentPhase = game.getCurrentPhase();
      let newGame = await currentPhase.end({ game });
      const newPhaseIndex = (currentPhaseIndex + 1) % phases.length;
      const newPhase = phases[newPhaseIndex];
      newGame = await newPhase.start({ game });
      return newGame.copy({
        currentPhaseIndex: newPhaseIndex
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
    getIncome(player) {
      return this.getTerritoriesForPlayer(player)
        .map(territory => {
          return territory.getIncome();
        })
        .reduce((acc, value) => acc + value, 0);
    }
    getCurrentPlayer() {
      const { players, currentPlayerIndex } = this;
      return players[currentPlayerIndex];
    }
    getCurrentPhase() {
      const { currentPhaseIndex, phases } = this;
      return phases[currentPhaseIndex];
    }
  };
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
