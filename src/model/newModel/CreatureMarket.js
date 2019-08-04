const baseCreatureCosts = [4, 3, 2];

module.exports = function(randomReaderAsync, CreatureCard) {
  return class CreatureMarket {
    constructor({
      creaturesDraw,
      creaturesDiscard = [],
      creaturesDisplay = []
    }) {
      this.creaturesDraw = creaturesDraw;
      this.creaturesDiscard = creaturesDiscard;
      this.creaturesDisplay = creaturesDisplay;
    }
    buyCreature({ player, templeAvailableCount, creatureId, args = [] }) {
      const index = this.getDisplayIndex(creatureId);
      const cost = baseCreatureCosts[index];
      const finalCost = Math.max(1, cost - templeAvailableCount);
      const discountUsed = cost - finalCost;
      // TODO handle immutability here
      const creature = this.getCreatureById(creatureId);
      creature.apply(this, player, args);
      const newPlayer = player.spend(finalCost).spendTemples(discountUsed);
      return {
        player: newPlayer,
        creature,
        creatureMarket: this.useCreature(creatureId)
      };
    }
    pushCreatures(wantedCount = 3) {
      const { creaturesDisplay, creaturesDraw } = this;
      let newDisplay = creaturesDisplay.concat([]);
      newDisplay[2] = null;
      newDisplay = newDisplay.filter(creature => !!creature);
      return randomReaderAsync.shuffle(creaturesDraw).then(shuffledDraw => {
        const toDrawCount = wantedCount - newDisplay.length;
        return this.copy({
          creaturesDisplay: shuffledDraw
            .slice(0, toDrawCount)
            .concat(newDisplay),
          creaturesDraw: shuffledDraw.slice(toDrawCount)
        });
      });
    }

    // private
    copy(params = {}) {
      return new CreatureMarket(Object.assign({}, this, params));
    }
    getDisplayIndex(creatureId) {
      const { creaturesDisplay } = this;
      const index = creaturesDisplay.indexOf(creatureId);
      if (index < 0) {
        throw new Error(
          `could not find creature ${JSON.stringify(creatureId)}`
        );
      }
      return index;
    }
    getCreatureById(creatureId) {
      return CreatureCard.all.find(creature => creature.id === creatureId);
    }
    useCreature(creatureId) {
      const { creaturesDisplay, creaturesDiscard } = this;
      return this.copy({
        creaturesDisplay: creaturesDisplay.map(c =>
          c && c === creatureId ? null : c
        ),
        creaturesDiscard: creaturesDiscard.concat([creatureId])
      });
    }
  };
};
