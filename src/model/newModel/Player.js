module.exports = function(GodCard) {
  return class Player {
    constructor({
      gold = 7,
      templeUsed = 0,
      cards = {},
      lastIncome = 0,
      id = Math.random() + ""
    } = {}) {
      this.gold = gold;
      this.templeUsed = templeUsed;
      this.cards = cards;
      this.lastIncome = lastIncome;

      this.id = id;
    }
    // writes
    spend(number) {
      const { gold } = this;
      if (gold < number) {
        throw new Error(
          "vous n'avez pas assez de sesterces. Cette action coûte " +
            number +
            " sesterce(s)."
        );
      }
      return this.copy({ gold: gold - number });
    }
    spendTemples(count) {
      return this.copy({ templeUsed: this.templeUsed + count });
    }

    addGodCard(card) {
      const { cards } = this;
      const newCards = Object.assign({}, cards);
      const { id: cardId } = card;
      const currentValue = this.getGodCardCount(card);
      newCards[cardId] = currentValue + 1;
      return this.copy({
        cards: newCards
      });
    }
    payBid(amount) {
      var goldLeft = amount - this.getPriests();
      var payment = Math.max(1, goldLeft);
      return this.spend(payment);
    }
    income(amount) {
      const { gold } = this;
      return this.copy({
        gold: gold + amount,
        lastIncome: amount
      });
    }

    // reads
    getGodCardCount(godCard) {
      const { id: cardId } = godCard;
      return this.cards[cardId] || 0;
    }
    getPriests() {
      return this.getGodCardCount(GodCard.Priest);
    }
    getPhilosophers() {
      return this.getGodCardCount(GodCard.Philosopher);
    }
    getMaxBid() {
      const { gold } = this;
      if (!gold) {
        return 0;
      }
      return gold + this.getPriests();
    }

    // private
    copy(params = {}) {
      return new Player(Object.assign({}, this, params));
    }
  };
};
