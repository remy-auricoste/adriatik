const baseCreatureCosts = [4, 3, 2];

module.exports = function(randomReaderAsync, CreatureCard) {
  const buildCard = card => card && new CreatureCard(card);

  return class CreatureMarket {
    constructor({
      creaturesDraw,
      creaturesDiscard = [],
      creaturesDisplay = []
    }) {
      this.creaturesDraw = creaturesDraw.map(buildCard);
      this.creaturesDiscard = creaturesDiscard.map(buildCard);
      this.creaturesDisplay = creaturesDisplay.map(buildCard);
    }
    buyCreature({ player, templeAvailableCount, creature, args = [] }) {
      const index = this.getDisplayIndex(creature);
      const cost = baseCreatureCosts[index];
      const finalCost = Math.max(1, cost - templeAvailableCount);
      const discountUsed = cost - finalCost;
      // TODO handle immutability here
      creature.apply(this, player, args);
      const newPlayer = player.spend(finalCost).spendTemples(discountUsed);
      return {
        player: newPlayer,
        creature,
        creatureMarket: this.useCreature(creature)
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
    getDisplayIndex(creature) {
      const { creaturesDisplay } = this;
      const index = creaturesDisplay.findIndex(
        creatureIte => creatureIte && creatureIte.name === creature.name
      );
      if (index < 0) {
        throw new Error(`could not find creature ${JSON.stringify(creature)}`);
      }
      return index;
    }
    useCreature(creature) {
      const { creaturesDisplay, creaturesDiscard } = this;
      return this.copy({
        creaturesDisplay: creaturesDisplay.map(c =>
          c && c.name === creature.name ? null : c
        ),
        creaturesDiscard: creaturesDiscard.concat([creature])
      });
    }
  };
};
