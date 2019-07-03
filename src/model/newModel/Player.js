var logger = require("../../alias/Logger").getLogger("Player");

module.exports = function(GodCard) {
  return class Player {
    constructor({
      gold = 7,
      templeUsed = 0,
      cards = {},
      id = Math.random() + ""
    } = {}) {
      this.gold = gold;
      this.templeUsed = templeUsed;
      this.cards = cards;

      this.id = id;
    }
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
      const currentValue = cards[card] || 0;
      newCards[card] = currentValue + 1;
      return this.copy({
        cards: newCards
      });
    }
    getGodCardCount(godCard) {
      return this.cards[godCard] || 0;
    }
    getPriests() {
      return this.getGodCardCount(GodCard.Priest);
    }
    getPhilosophers() {
      return this.getGodCardCount(GodCard.Philosopher);
    }
    payBid(amount) {
      var goldLeft = amount - this.getPriests();
      var payment = Math.max(1, goldLeft);
      return this.spend(payment);
    }

    // private
    copy(params = {}) {
      return new Player(Object.assign({}, this, params));
    }
  };
};
