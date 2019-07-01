const Building = require("./Building");
const GodCard = require("./GodCard");
const UnitType = require("./UnitType");
const God = require("./God")(Building, GodCard, UnitType);

const DataTest = require("./DataTest");

const { territory, player } = DataTest;

describe("God class", function() {
  describe("build method", function() {
    it("should build a building", function() {
      // when
      const god = God.Minerve;
      const result = god.build({ territory, player });
      // then

      expect(territory.buildSlots).to.equal(3);
      expect(territory.buildings).to.deep.equal([Building.Fort]);
    });
    it("should throw an exception if Ceres god is currently associated with the player", function() {
      expect(() => {
        God.Ceres.build({ territory, player });
      }).to.throw(
        "Il est impossible de construire : ce dieu ne peut pas construire ce tour-ci."
      );
    });
    it("should throw an exception if there is no slot left on the territory", function() {
      // then
      expect(function() {
        god.build({ territory, player });
      }).to.throw(
        "Il est impossible de construire : il n'y a aucun emplacement libre sur le territoire sélectionné."
      );
    });
    it("should throw an exception if there is not enough gold", function() {
      const player = DataTest.player.copy({ gold: 1 });
      expect(function() {
        God.Minerve.build({ territory, player });
      }).to.throw(
        "Il est impossible de construire : vous n'avez pas assez de sesterces. Cette action coûte 2 sesterce(s)."
      );
    });
  });
});
