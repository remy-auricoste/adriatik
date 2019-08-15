class PlayerBattle {
  constructor({
    playerId,
    strength,
    score,
    loss = 0,
    resolvedLoss = 0,
    decision = undefined
  } = {}) {
    this.playerId = playerId;
    this.strength = strength;
    this.score = score;
    this.loss = loss;
    this.resolvedLoss = resolvedLoss;
    this.decision = decision;
    this.id = "battle";
  }
  copy(params = {}) {
    return new PlayerBattle(Object.assign({}, this, params));
  }
}

module.exports = function(Dice, Building, Territory, Player) {
  return class Battle {
    constructor({
      territory,
      attacker,
      defender,
      states = [],
      id = Math.random() + ""
    }) {
      this.territory = new Territory(territory);
      this.attacker = new Player(attacker);
      this.defender = new Player(defender);
      this.states = states.map(_ => new PlayerBattle(_));
      this.id = id;
    }
    buildLosses() {
      const { attacker, defender } = this;
      const players = [attacker, defender];
      return Promise.all([
        this.getScore(attacker),
        this.getScore(defender)
      ]).then(([scoreAttacker, scoreDefender]) => {
        const scores = [scoreAttacker, scoreDefender];
        const newStates = players.map((player, index) => {
          const otherIndex = 1 - index;
          const score = scores[index];
          const otherScore = scores[otherIndex];
          return new PlayerBattle({
            playerId: player.id,
            score: scores[index],
            strength: this.getStrength(player),
            loss: score <= otherScore ? 1 : 0
          });
        });
        return this.copy({
          states: newStates
        });
      });
    }
    resolveLoss(player) {
      return this.updateState(player, state =>
        state.copy({
          resolvedLoss: state.resolvedLoss + 1
        })
      );
    }
    makeDecision(player, decision) {
      return this.updateState(player, state =>
        state.copy({
          decision
        })
      );
    }

    //reads
    getStrength(player) {
      const { territory } = this;
      const unitsCount = territory.getUnits(player).length;
      const buildingsCount = this.isAttacker(player)
        ? 0
        : this.getDefendingBuildings().length;
      return unitsCount + buildingsCount;
    }
    getScore(player) {
      const strength = this.getStrength(player);
      return Dice().then(diceCount => {
        return strength + diceCount;
      });
    }
    getDefendingBuildings() {
      const { territory } = this;
      // TODO handle sea battles
      return territory.buildings.filter(building => {
        return (
          building.id === Building.Fort.id || building.id === Building.Cite.id
        );
      });
    }
    isAttacker(player) {
      return player.id === this.attacker.id;
    }
    isDefender(playerId) {
      return playerId === this.defender.id;
    }
    getState(player, state = this) {
      return state.states.find(state => state.playerId === player.id);
    }
    isLossResolved(player, state = this) {
      const { resolvedLoss, loss } = this.getState(player, state);
      return resolvedLoss === loss;
    }
    isAutoLossPossible(player, state = this) {
      const { territory } = state;
      const isResolved = this.isLossResolved(player, state);
      if (isResolved) {
        return false;
      }
      const units = territory.getUnits(player);
      const firstUnit = units[0];
      if (!firstUnit) {
        throw new Error(
          `illegal state : ${
            player.id
          } has a loss but no units on the territory`
        );
      }
      const allSameType = units.every(
        unit => unit.type.id === firstUnit.type.id
      );
      return allSameType;
    }
    shouldMakeDecision(player) {
      const { territory } = this;
      const units = territory.getUnits(player);
      return (
        this.isLossResolved(player) && !!units.length && territory.hasConflict()
      );
    }
    hasMadeDecision(player) {
      return !!this.getState(player).decision;
    }

    // private
    updateState(player, changeFct) {
      const { states } = this;
      const newStates = states.map(state => {
        if (state.playerId !== player.id) {
          return state;
        }
        return changeFct(state);
      });
      return this.copy({
        states: newStates
      });
    }
    copy(params = {}) {
      return new Battle(Object.assign({}, this, params));
    }
  };
};
