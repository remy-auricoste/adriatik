const Injector = require("../../Injector");
const injector = Injector.instance;

const {
  DataTest,
  TerritoryType,
  Territory,
  Unit,
  UnitType,
  Player
} = injector.resolveAll();

const { earth, sea } = TerritoryType;
const { player } = DataTest;

describe("Territory class", () => {
  describe("moveUnit method", () => {
    it("should move an earth unit from a territory to another", () => {
      const unit = new Unit({ ownerId: player.id, type: UnitType.Legionnaire });
      const territory = new Territory({ type: earth }).placeUnit(unit);
      const territory2 = new Territory({ type: earth });
      expect(territory.getUnits(player).length).to.equal(1);

      const [new1, new2] = territory.moveUnit(unit, territory2);
      expect(new1.getUnits(player).length).to.equal(0);
      expect(new2.getUnits(player).length).to.equal(1);
    });
    it("should throw an exception if the destination territory is sea and unit is earth type", () => {
      const unit = new Unit({ ownerId: player.id, type: UnitType.Legionnaire });
      const territory = new Territory({ type: earth }).placeUnit(unit);
      const territory2 = new Territory({ type: sea });
      expect(territory.getUnits(player).length).to.equal(1);

      expect(() => {
        territory.moveUnit(unit, territory2);
      }).to.throw(
        "il est impossible de placer ce type d'unité sur ce type de territoire."
      );
    });
  });
  describe("moveUnits method", () => {
    it("should move several units at once", () => {
      const unit = new Unit({ ownerId: player.id, type: UnitType.Legionnaire });
      const unit2 = new Unit({
        ownerId: player.id,
        type: UnitType.Legionnaire
      });
      const territory = new Territory({ type: earth }).placeUnits([
        unit,
        unit2
      ]);
      const territory2 = new Territory({ type: earth });
      expect(territory.getUnits(player).length).to.equal(2);

      const [new1, new2] = territory.moveUnits([unit, unit2], territory2);
      expect(new1.getUnits(player).length).to.equal(0);
      expect(new2.getUnits(player).length).to.equal(2);
    });
  });
  describe("hasConflict method", () => {
    it("should return false if all units are owned by the same player", () => {
      const unit = new Unit({ ownerId: player.id, type: UnitType.Legionnaire });
      const unit2 = new Unit({
        ownerId: player.id,
        type: UnitType.Legionnaire
      });
      const territory = new Territory({ type: earth }).placeUnits([
        unit,
        unit2
      ]);

      expect(territory.hasConflict()).to.equal(false);
    });
    it("should return true if units are owned by several players", () => {
      const player2 = new Player();
      const unit = new Unit({ ownerId: player.id, type: UnitType.Legionnaire });
      const unit2 = new Unit({
        ownerId: player2.id,
        type: UnitType.Legionnaire
      });
      const territory = new Territory({ type: earth }).placeUnits([
        unit,
        unit2
      ]);

      expect(territory.hasConflict()).to.equal(true);
    });
  });
});
