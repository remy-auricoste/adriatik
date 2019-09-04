module.exports = function(
  CreatureCard,
  CreatureMarket,
  GameSettings,
  BidsState,
  PhaseBid,
  PhaseAction,
  RandomReaderAsync,
  Building,
  Player,
  God,
  Territory,
  BattleFSM,
  Battle,
  Arrays
) {
  return class Game {
    constructor({
      turn = 1,
      territories = [],
      players = [],
      creatureMarket = new CreatureMarket({
        creaturesDraw: CreatureCard.all.map(_ => _.id)
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
      if (battle) {
        if (battle.constructor.name === "FiniteStateMachine") {
          this.battle = battle;
        } else {
          battle.state = new Battle(battle.state);
          this.battle = BattleFSM.restoreFsm(battle);
          if (this.battle.isDone()) {
            this.battle = undefined;
          }
        }
      }
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
    start() {
      const game = this;
      const { players } = game;
      return RandomReaderAsync.shuffle(players).then(newPlayers => {
        const newGame = game.copy({
          players: newPlayers
        });
        return newGame.getCurrentPhase().start({ game: newGame });
      });
    }
    nextPhase(game = this) {
      const { currentPhaseIndex, phases } = game;
      const currentPhase = game.getCurrentPhase();
      return currentPhase.end({ game }).then(newGame => {
        const newPhaseIndex = (currentPhaseIndex + 1) % phases.length;
        const newPhase = phases[newPhaseIndex];
        return newPhase.start({ game: newGame }).then(newGame => {
          return newGame.copy({
            currentPhaseIndex: newPhaseIndex
          });
        });
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
    findPath({ fromTerritory, toTerritory, isValidFct }) {
      if (fromTerritory.id === toTerritory.id) {
        return [fromTerritory];
      }
      return this.findPathExtended({
        possibleFromPaths: [[fromTerritory]],
        toTerritory,
        isValidFct
      });
    }
    findPathExtended({ possibleFromPaths, toTerritory, isValidFct }) {
      const foundDirectPath = possibleFromPaths.find(path => {
        const lastTerritory = path[path.length - 1];
        return lastTerritory.isNextTo(toTerritory);
      });
      if (foundDirectPath) {
        return foundDirectPath.concat([toTerritory]);
      }
      const newPassedTerritories = Arrays.toSet(
        Arrays.flatMap(possibleFromPaths, path => {
          return path.map(_ => _.id);
        })
      );
      const newPossiblePaths = Arrays.flatMap(possibleFromPaths, path => {
        const lastTerritory = path[path.length - 1];
        return lastTerritory.neighbours
          .filter(id => newPassedTerritories.indexOf(id) === -1)
          .map(id => this.getEntityById(id))
          .filter(isValidFct)
          .map(_ => path.concat([_]));
      });
      if (!newPossiblePaths.length) {
        return null;
      }
      return this.findPathExtended({
        possibleFromPaths: newPossiblePaths,
        toTerritory,
        isValidFct
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
