module.exports = function(God, Bid) {
  return class BidsState {
    constructor({ bids = [] } = {}) {
      this.bids = bids.map(_ => new Bid(_));
    }

    placeBid({ player, god, amount }) {
      const bid = new Bid({ playerId: player.id, godId: god.id, amount });
      try {
        if (god.id === God.Ceres.id) {
          if (amount !== 0) {
            throw new Error("cannot bid other than 0 on Ceres");
          }
          return this.addBid(bid);
        }
        const missingGold = amount - (player.gold + player.getPriests());
        if (missingGold > 0) {
          throw new Error(`il vous manque ${missingGold} sesterces.`);
        }
        const previousBids = this.getBidsForGod(god);
        if (!previousBids.length) {
          return this.addBid(bid);
        }
        if (previousBids.length !== 1) {
          throw new Error("weird state : several bids on the same god");
        }
        const previousBid = previousBids[0];
        if (amount <= previousBid.amount) {
          throw new Error("votre enchère n'est pas assez importante.");
        }
        if (previousBid.playerId === bid.playerId) {
          throw new Error("il est interdit de surenchérir sur le même dieu.");
        }
        return this.removeBidsForGod(god).addBid(bid);
      } catch (err) {
        throw err.prefix("Il est impossible de placer cette enchère : ");
      }
    }
    getBidForPlayer(player) {
      return this.bids.find(bid => bid.playerId === player.id);
    }
    init() {
      return new BidsState();
    }

    // private
    addBid(bid) {
      const { bids } = this;
      return new BidsState({
        bids: bids
          .filter(bidIte => bid.playerId !== bidIte.playerId)
          .concat([bid])
      });
    }
    removeBidsForGod(god) {
      const { bids } = this;
      return new BidsState({
        bids: bids.filter(bid => bid.godId !== god.id)
      });
    }
    getBidsForGod(god) {
      return this.bids.filter(bid => bid.godId === god.id);
    }
  };
};
