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
    tryAutoLoss(player) {
      const { territory } = this;
      const { resolvedLoss, loss } = this.getState(player);
      if (resolvedLoss === loss) {
        return { battle: this };
      }
      const units = territory.getUnits(player);
      const firstUnit = units[0];
      if (!firstUnit) {
        throw new Error(
          `illegal state : has a loss but no units on the territory`
        );
      }
      const allSameType = units.every(unit => unit.type === firstUnit.type);
      if (!allSameType) {
        return { battle: this };
      }
      const newTerritory = territory.removeUnit(firstUnit);
      return {
        territory: newTerritory,
        battle: this.resolveLoss(player).copy({ territory: newTerritory })
      };
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
    getState(player) {
      return this.states.find(state => state.playerId === player.id);
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
