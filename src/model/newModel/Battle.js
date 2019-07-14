const phases = {
  start: "start",
  dices: "dices",
  resolve: "resolve",
  retreat: "retreat"
};

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
  }
  copy(params = {}) {
    return new PlayerBattle(Object.assign({}, this, params));
  }
}

module.exports = function(Dice, Building) {
  return class Battle {
    constructor({ territory, attacker, defender, states = [] }) {
      this.territory = territory;
      this.attacker = attacker;
      this.defender = defender;
      this.states = states;
    }
    async buildLosses() {
      const { attacker, defender } = this;
      const players = [attacker, defender];
      const scoreAttacker = await this.getScore(attacker);
      const scoreDefender = await this.getScore(defender);
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
        : territory.buildings.filter(
            building => building === Building.Fort || building === Building.Cite
          ).length;
      return unitsCount + buildingsCount;
    }
    async getScore(player) {
      const strength = this.getStrength(player);
      const diceCount = await Dice();
      return strength + diceCount;
    }
    isAttacker(player) {
      return player.id === this.attacker.id;
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
