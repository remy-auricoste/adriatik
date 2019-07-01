const Injector = require("../../Injector");
const injector = Injector.instance;

const { Building, DataTest, God } = injector.resolveAll();

const { territory, player } = DataTest;

describe.only("God class", () => {
  describe("build method", () => {
    it("should build a building", () => {
      // when
      const god = God.Minerve;
      const result = god.build({ territory, player });
      // then
      expect(result.territory.buildSlots).to.equal(3);
      expect(result.territory.buildings).to.deep.equal([Building.Fort]);
      expect(result.player.gold).to.deep.equal(5);
    });
    it("should throw an exception if Ceres god is currently associated with the player", () => {
      expect(() => {
        God.Ceres.build({ territory, player });
      }).to.throw(
        "Il est impossible de construire : ce dieu ne peut pas construire ce tour-ci."
      );
    });
    it("should throw an exception if there is no slot left on the territory", () => {
      const territory = DataTest.territory.copy({ buildSlots: 0 });
      const god = God.Minerve;
      // then
      expect(() => {
        god.build({ territory, player });
      }).to.throw(
        "Il est impossible de construire : il n'y a aucun emplacement libre sur le territoire sélectionné."
      );
    });
    it("should throw an exception if there is not enough gold", () => {
      const player = DataTest.player.copy({ gold: 1 });
      expect(() => {
        God.Minerve.build({ territory, player });
      }).to.throw(
        "Il est impossible de construire : vous n'avez pas assez de sesterces. Cette action coûte 2 sesterce(s)."
      );
    });
  });
});
