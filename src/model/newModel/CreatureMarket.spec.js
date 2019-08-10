const { CreatureCard, CreatureMarket, DataTest } = injector.resolveAll();

const { player } = DataTest;

const creatureId = "Sphinx";
const creatureId2 = "Méduse";
const creaturesDraw = [creatureId, creatureId, creatureId];

describe("CreatureMarket class", () => {
  describe("buyCreature method", () => {
    it("should buy the creatures for player. Temples should be used only once", () => {
      const market = new CreatureMarket({
        creaturesDraw,
        creaturesDisplay: [creatureId, creatureId2, null]
      });
      // when
      const result = market.buyCreature({
        templeAvailableCount: 1,
        creatureId,
        player
      });
      // then
      expect(result.player.gold).to.equal(7 - 3);
      expect(result.player.templeUsed).to.equal(1);
      expect(result.creatureMarket.creaturesDisplay).to.deep.equal([
        null,
        creatureId2,
        null
      ]);

      // when
      const result2 = result.creatureMarket.buyCreature({
        templeAvailableCount: 0,
        creatureId: creatureId2,
        player: result.player
      });
      // then
      expect(result2.player.gold).to.equal(7 - 3 - 3);
      expect(result2.player.templeUsed).to.equal(1);
      expect(result2.creatureMarket.creaturesDisplay).to.deep.equal([
        null,
        null,
        null
      ]);
    });
  });

  describe("pushCreatures method", () => {
    const testFilled = initState => {
      const market = new CreatureMarket({
        creaturesDisplay: initState,
        creaturesDraw
      });
      return market.pushCreatures().then(newMarket => {
        const { creaturesDisplay } = newMarket;
        expect(creaturesDisplay.length).to.equal(3);
        expect(creaturesDisplay.filter(c => c).length).to.equal(3);
      });
    };

    it("should push the creatures [X, X, 0]", () => {
      return testFilled([creatureId, creatureId, null]);
    });

    it("should push the creatures [X, 0, X]", () => {
      return testFilled([creatureId, null, creatureId]);
    });

    it("should push the creatures [0, X, X]", () => {
      return testFilled([null, creatureId, creatureId]);
    });
    it("should push the creatures [0, 0, X]", () => {
      return testFilled([null, null, creatureId]);
    });
    it("should push the creatures [0, X, 0]", () => {
      return testFilled([null, creatureId, null]);
    });
    it("should push the creatures [X, 0, 0]", () => {
      return testFilled([creatureId, null, null]);
    });
    it("should push the creatures [0, 0, 0]", () => {
      return testFilled([null, null, null]);
    });
  });
});
