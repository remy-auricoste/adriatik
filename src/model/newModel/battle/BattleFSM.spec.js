const Injector = require("../../../Injector");
const injector = Injector.instance;

const { DataTest, BattleFSM, Battle } = injector.resolveAll();

const { legionnaire, player } = DataTest;

describe.only("BattleFSM class", () => {
  it("should do everything in automatic mode", () => {
    const attacker = player.copy({ id: "1" });
    const defender = player.copy({ id: "2" });
    const territory = DataTest.territory
      .placeUnit(legionnaire.copy({ ownerId: attacker.id }))
      .placeUnit(legionnaire.copy({ ownerId: defender.id }));
    const battle = new Battle({ territory, attacker, defender });
    const battleFSM = BattleFSM.build(battle);
    console.log(battleFSM.getHistory());
    setTimeout(() => {
      console.log(battleFSM.getHistory());
    }, 50);
  });
});
