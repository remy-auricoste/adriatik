module.exports = function(
  CreatureCard,
  CreatureMarket,
  GameSettings,
  BidsState,
  PhaseBid,
  PhaseAction,
  randomReaderAsync,
  Building,
  Player,
  God,
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
      currentPhaseIndex = 0,
      battle = undefined
    } = {}) {
      this.turn = turn;
      this.players = players.map(_ => new Player(_));
      this.creatureMarket = new CreatureMarket(creatureMarket);
      this.gods = gods.map(_ => new God(_));
      this.settings = new GameSettings(settings);
      this.bidState = new BidsState(bidState);
      this.currentPlayerIndex = currentPlayerIndex;
      this.phases = [new PhaseBid(), new PhaseAction()];
      this.currentPhaseIndex = currentPhaseIndex;
      this.territories = territories.map(_ => new Territory(_));
      this.battle = battle;
    }
    //writes
    update(entity) {
      const game = this;
      if (entity.constructor.name === "Battle") {
        return this.copy({ battle: entity });
      }
      const entitiesName = game.getEntitiesNameByName(entity.constructor.name);
      const entities = game[entitiesName];
      const index = entities.findIndex(entity2 => entity2.id === entity.id);
      if (index < 0) {
        throw new Error(
          `could not find entity ${entity.constructor.name} ${JSON.stringify(
            entity
          )}`
        );
      }
      const newEntities = entities.concat([]);
      newEntities.splice(index, 1, entity);
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
      const { players } = game;
      const newPlayers = await randomReaderAsync.shuffle(players);
      const newGame = game.copy({
        players: newPlayers
      });
      return await newGame.getCurrentPhase().start({ game: newGame });
    }
    async nextPhase(game = this) {
      const { currentPhaseIndex, phases } = game;
      const currentPhase = game.getCurrentPhase();
      let newGame = await currentPhase.end({ game });
      const newPhaseIndex = (currentPhaseIndex + 1) % phases.length;
      const newPhase = phases[newPhaseIndex];
      newGame = await newPhase.start({ game: newGame });
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
            return (
              building.id === Building.Temple.id ||
              building.id === Building.Cite.id
            );
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
    getCurrentGod() {
      const { bidState } = this;
      if (!bidState) {
        return null;
      }
      const player = this.getCurrentPlayer();
      const bid = bidState.getBidForPlayer(player);
      if (!bid) {
        return null;
      }
      const { godId } = bid;
      return this.getEntityById(godId);
    }
    getCurrentPlayerAndGod() {
      const player = this.getCurrentPlayer();
      const god = this.getCurrentGod();
      return { player, god };
    }
    getCurrentPhase() {
      const { currentPhaseIndex, phases } = this;
      return phases[currentPhaseIndex];
    }
    findPath({
      fromTerritory,
      toTerritory,
      isValidFct,
      currentPath = [],
      passedTerritories = []
    }) {
      if (fromTerritory.isNextTo(toTerritory)) {
        return currentPath.concat([toTerritory]);
      }
      const neighbourIdsLeft = fromTerritory.neighbours.filter(
        id => passedTerritories.indexOf(id) === -1
      );
      if (!neighbourIdsLeft.length) {
        return null;
      }
      const possibleNeighbours = neighbourIdsLeft
        .map(id => this.getEntityById(id))
        .filter(isValidFct);
      passedTerritories.push(fromTerritory.id);
      return possibleNeighbours.find(territory => {
        return this.findPath({
          fromTerritory: territory,
          toTerritorry: toTerritory,
          isValidFct,
          currentPath: currentPath.concat([territory]),
          passedTerritories
        });
      });
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
