const { DataTest, BattleFSM, Battle } = injector.resolveAll();

const { legionnaire, player } = DataTest;

describe("BattleFSM class", () => {
  it("should do everything in automatic mode (1 vs 1)", () => {
    const attacker = player.copy({ id: "1" });
    const defender = player.copy({ id: "2" });
    const territory = DataTest.territory
      .placeUnit(legionnaire.copy({ ownerId: attacker.id }))
      .placeUnit(legionnaire.copy({ ownerId: defender.id }));
    const battle = new Battle({ territory, attacker, defender });
    const battleFSM = BattleFSM.build(battle);
    return battleFSM.getReadyPromise().then(() => {
      expect(battleFSM.isDone()).to.equal(true);
    });
  });
  it("should do automatic loss (2 vs 2)", () => {
    const attacker = player.copy({ id: "1" });
    const defender = player.copy({ id: "2" });
    const territory = DataTest.territory
      .placeUnit(legionnaire.copy({ ownerId: attacker.id }))
      .placeUnit(legionnaire.copy({ ownerId: attacker.id }))
      .placeUnit(legionnaire.copy({ ownerId: defender.id }))
      .placeUnit(legionnaire.copy({ ownerId: defender.id }));
    const battle = new Battle({ territory, attacker, defender });
    const battleFSM = BattleFSM.build(battle);
    return battleFSM.getReadyPromise().then(() => {
      expect(battleFSM.isDone()).to.equal(false);
      const state = battleFSM.getState();
      const { attacker, defender } = state;
      battleFSM.updateState(state.makeDecision(attacker, "stay"));
      battleFSM.updateState(state.makeDecision(defender, "stay"));
      expect(battleFSM.isDone()).to.equal(true);
    });
  });
  it("should do all automatic (2 vs 1)", () => {
    const attacker = player.copy({ id: "1" });
    const defender = player.copy({ id: "2" });
    const territory = DataTest.territory
      .placeUnit(legionnaire.copy({ ownerId: attacker.id }))
      .placeUnit(legionnaire.copy({ ownerId: attacker.id }))
      .placeUnit(legionnaire.copy({ ownerId: defender.id }));
    const battle = new Battle({ territory, attacker, defender });
    const battleFSM = BattleFSM.build(battle);
    return battleFSM.getReadyPromise().then(() => {
      expect(battleFSM.isDone()).to.equal(true);
    });
  });
});
