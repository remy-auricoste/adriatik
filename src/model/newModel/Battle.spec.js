const Injector = require("../../Injector");
const injector = Injector.instance;

const {
  Battle,
  Player,
  Unit,
  UnitType,
  Territory,
  TerritoryType,
  Building
} = injector.resolveAll();

const seq = (min, max) => {
  const result = [];
  for (let i = min; i < max; i++) {
    result.push(i);
  }
  return result;
};

const initBattle = (
  [attackerUnitCount, defenderUnitCount],
  territory = new Territory({ type: TerritoryType.earth })
) => {
  const attacker = new Player();
  const defender = new Player();
  seq(0, attackerUnitCount).forEach(() => {
    territory = territory.placeUnit(
      new Unit({ ownerId: attacker.id, type: UnitType.Legionnaire })
    );
  });
  seq(0, defenderUnitCount).forEach(() => {
    territory = territory.placeUnit(
      new Unit({ ownerId: defender.id, type: UnitType.Legionnaire })
    );
  });
  const battle = new Battle({ territory, attacker, defender });
  return battle.buildLosses();
};

const getInitResults = battle => {
  return battle.states.map(({ strength, score, loss }) => {
    return { strength, score, loss };
  });
};

describe.only("Battle class", () => {
  describe("buildLosses method", () => {
    it("should calculate strengths, scores and losses (1 vs 1)", () => {
      return initBattle([1, 1]).then(battle => {
        expect(getInitResults(battle)).to.deep.equal([
          { strength: 1, score: 1, loss: 1 },
          { strength: 1, score: 1, loss: 1 }
        ]);
      });
    });
    it("should calculate strengths, scores and losses (2 vs 1)", () => {
      return initBattle([2, 1]).then(battle => {
        expect(getInitResults(battle)).to.deep.equal([
          { strength: 2, score: 2, loss: 0 },
          { strength: 1, score: 1, loss: 1 }
        ]);
      });
    });
    it("should calculate strengths, scores and losses (1 vs 3)", () => {
      return initBattle([1, 3]).then(battle => {
        expect(getInitResults(battle)).to.deep.equal([
          { strength: 1, score: 1, loss: 1 },
          { strength: 3, score: 3, loss: 0 }
        ]);
      });
    });
    it("should calculate strengths, scores and losses (1 vs 1 + fort)", () => {
      const territory = new Territory({
        type: TerritoryType.earth,
        buildings: [Building.Fort]
      });
      return initBattle([1, 1], territory).then(battle => {
        expect(getInitResults(battle)).to.deep.equal([
          { strength: 1, score: 1, loss: 1 },
          { strength: 2, score: 2, loss: 0 }
        ]);
      });
    });
    it("should calculate strengths, scores and losses (1 vs 1 + cite)", () => {
      const territory = new Territory({
        type: TerritoryType.earth,
        buildings: [Building.Cite]
      });
      return initBattle([1, 1], territory).then(battle => {
        expect(getInitResults(battle)).to.deep.equal([
          { strength: 1, score: 1, loss: 1 },
          { strength: 2, score: 2, loss: 0 }
        ]);
      });
    });
    it("should calculate strengths, scores and losses (3 vs 1 + cite + fort)", () => {
      const territory = new Territory({
        type: TerritoryType.earth,
        buildings: [Building.Cite, Building.Fort]
      });
      return initBattle([3, 1], territory).then(battle => {
        expect(getInitResults(battle)).to.deep.equal([
          { strength: 3, score: 3, loss: 1 },
          { strength: 3, score: 3, loss: 1 }
        ]);
      });
    });
  });
  describe("resolveLoss method", () => {
    it("should add 1 to the resolved losses of a player", () => {
      return initBattle([1, 1]).then(battle => {
        const { attacker } = battle;
        battle = battle.resolveLoss(attacker);
        const attackerState = battle.states.find(
          state => state.playerId === attacker.id
        );
        expect(attackerState.resolvedLoss).to.equal(1);
      });
    });
  });
  describe("tryAutoLoss method", () => {
    it("should remove a unit if all units are the same", () => {
      return initBattle([2, 3]).then(battle => {
        const { attacker, defender } = battle;
        expect(battle.tryAutoLoss(defender)).to.deep.equal({ battle });
        const result = battle.tryAutoLoss(attacker);
        expect(result.battle.getState(attacker).resolvedLoss).to.equal(1);
        expect(result.territory.getUnits(attacker).length).to.equal(1);
      });
    });
  });
});
