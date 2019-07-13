module.exports = function(
  CreatureCard,
  CreatureMarket,
  GameSettings,
  BidsState,
  PhaseBid,
  PhaseAction,
  randomReaderAsync,
  Building,
  Territory
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
      this.players = players;
      this.creatureMarket = creatureMarket;
      this.gods = gods;
      this.settings = settings;
      this.bidState = bidState;
      this.currentPlayerIndex = currentPlayerIndex;
      this.phases = phases;
      this.currentPhaseIndex = currentPhaseIndex;
      this.territories = territories;
    }
    //writes
    update(entity) {
      const game = this;
      const entitiesName = game.getEntitiesNameByName(entity.constructor.name);
      const entities = game[entitiesName];
      const newEntities = entities
        .filter(entity2 => entity2.id !== entity.id)
        .concat([entity]);
      const updatedParams = {};
      updatedParams[entitiesName] = newEntities;
      return this.copy(updatedParams);
    }
    updateAll(obj) {
      const game = this;
      return Object.values(obj).reduce(
        (gameAcc, entity) => gameAcc.update(entity),
        game
      );
    }
    async start() {
      const game = this;
      const { players, territories, gods } = game;
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
    getTemples(player) {
      return this.getTerritoriesForPlayer(player)
        .map(territory => {
          return territory.buildings.filter(building => {
            return building === Building.Temple || building === Building.Cite;
          }).length;
        })
        .reduce((acc, value) => acc + value, 0);
    }
    getEntityById(id) {
      const { territories, players, gods } = this;
      return territories
        .concat(players)
        .concat(gods)
        .find(entity => entity.id === id);
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
    getCurrentPlayerAndGod({ game = this } = {}) {
      const { bidState } = game;
      const player = game.getCurrentPlayer();
      const godId = bidState.getBidForPlayer(player).godId;
      const god = game.getEntityById(godId);
      return { player, god };
    }
    getCurrentPhase() {
      const { currentPhaseIndex, phases } = this;
      return phases[currentPhaseIndex];
    }
    // private
    getEntitiesNameByName(className) {
      switch (className) {
        case "Territory":
          return "territories";
        case "Player":
          return "players";
        case "God":
          return "gods";
        default:
          throw new Error(`no entity group for class name ${className}`);
      }
    }
  };
};

// module.exports = class Game {
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
