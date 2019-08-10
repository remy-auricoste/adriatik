const { BidsState, God, DataTest, GodCard } = injector.resolveAll();

const { player } = DataTest;

describe("BidsState class", function() {
  describe("placeBid method", function() {
    it("should place a bid", function() {
      const bidsState = new BidsState();
      const newState = bidsState.placeBid({
        player,
        god: God.Minerve,
        amount: 3
      });
      // then
      expect(newState.getBidForPlayer(player)).to.deep.equal({
        playerId: player.id,
        godId: "minerve",
        amount: 3
      });
    });
    it("should place a bid with priests", function() {
      // given
      const bidsState = new BidsState();
      let player = DataTest.player;
      player = player.addGodCard(GodCard.Priest);
      player = player.addGodCard(GodCard.Priest);
      player = player.addGodCard(GodCard.Priest);
      player = player.copy({ gold: 3 });
      // when
      const newState = bidsState.placeBid({
        player,
        god: God.Minerve,
        amount: 6
      });
      // then
      expect(newState.getBidForPlayer(player).amount).to.equal(6);
    });
    it("should throw an exception because not enough gold", function() {
      // given
      const bidsState = new BidsState();
      const player = DataTest.player.copy({ gold: 3 });
      // then
      expect(function() {
        const newState = bidsState.placeBid({
          player,
          god: God.Minerve,
          amount: 4
        });
      }).to.throw(
        "Il est impossible de placer cette enchère : il vous manque 1 sesterces."
      );
    });
    it("should throw an exception because bidding twice on the same god", function() {
      // given
      const player = DataTest.player.copy({ gold: 3 });
      const bidsState = new BidsState();
      // then
      const newState = bidsState.placeBid({
        player,
        god: God.Minerve,
        amount: 2
      });
      expect(() => {
        newState.placeBid({
          player,
          god: God.Minerve,
          amount: 3
        });
      }).to.throw(
        "Il est impossible de placer cette enchère : il est interdit de surenchérir sur le même dieu."
      );
    });
  });
});
