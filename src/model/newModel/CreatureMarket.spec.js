const Injector = require("../../Injector");
const injector = Injector.instance;

const { CreatureCard, CreatureMarket, DataTest } = injector.resolveAll();

const { player } = DataTest;

const creature = CreatureCard.Sphinx;
const creature2 = CreatureCard.Méduse;
const creaturesDraw = [creature, creature, creature];

describe("CreatureMarket class", function() {
  describe("buyCreature method", function() {
    it("should buy the creatures for player. Temples should be used only once", function() {
      const market = new CreatureMarket({
        creaturesDraw,
        creaturesDisplay: [creature, creature2, null]
      });
      // when
      const result = market.buyCreature({
        templeAvailableCount: 1,
        creature,
        player
      });
      // then
      expect(result.player.gold).to.equal(7 - 3);
      expect(result.player.templeUsed).to.equal(1);
      expect(result.creatureMarket.creaturesDisplay).to.deep.equal([
        null,
        creature2,
        null
      ]);

      // when
      const result2 = result.creatureMarket.buyCreature({
        templeAvailableCount: 0,
        creature: creature2,
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

  describe("pushCreatures method", function() {
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
      return testFilled([creature, creature, null]);
    });

    it("should push the creatures [X, 0, X]", () => {
      return testFilled([creature, null, creature]);
    });

    it("should push the creatures [0, X, X]", () => {
      return testFilled([null, creature, creature]);
    });
    it("should push the creatures [0, 0, X]", () => {
      return testFilled([null, null, creature]);
    });
    it("should push the creatures [0, X, 0]", () => {
      return testFilled([null, creature, null]);
    });
    it("should push the creatures [X, 0, 0]", () => {
      return testFilled([creature, null, null]);
    });
    it("should push the creatures [0, 0, 0]", () => {
      return testFilled([null, null, null]);
    });
  });
});
