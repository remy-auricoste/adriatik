const Injector = require("../../Injector");
const injector = Injector.instance;

const {
  Building,
  DataTest,
  God,
  TerritoryType,
  Territory
} = injector.resolveAll();

const { territory, player, legionnaire } = DataTest;

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
  describe("buyUnit method", () => {
    const god = God.Minerve;
    const territory = DataTest.territory.placeUnit(legionnaire);

    it("should buy a unit and place it on the territory (Minerve)", () => {
      const result = god.buyUnit({ territory, player });
      // then
      expect(result.territory.units.length).to.equal(2); // there was already one
      expect(result.player.gold).to.equal(7); // first unit is free of charge
    });
    it("should buy a unit and place it on the territory (Neptune)", () => {
      // given
      const god = God.Neptune;
      const territory = DataTest.territory.placeUnit(legionnaire);
      const territory2 = new Territory({
        type: TerritoryType.sea
      });
      territory.nextTo(territory2);

      // when
      god.buyUnit({ territory: territory2, player });
      // then
      expect(territory.units.length).to.equal(1);
    });
    it("should throw an exception the player does not have enough gold", () => {
      // given
      const god = God.Minerve;
      const player = DataTest.player.copy({ gold: 5 });
      // then
      let result;
      result = god.buyUnit({ territory, player });
      result = result.god.buyUnit({
        territory: result.territory,
        player: result.player
      });
      result = result.god.buyUnit({
        territory: result.territory,
        player: result.player
      });
      expect(() => {
        result = result.god.buyUnit({
          territory: result.territory,
          player: result.player
        });
      }).to.throw(
        "Il est impossible d'acheter une unité : vous n'avez pas assez de sesterces. Cette action coûte 4 sesterce(s)."
      );
    });
    it("should throw an exception if the god cannot give units", () => {
      // given
      const god = God.Junon;
      // then
      expect(() => {
        god.buyUnit({ player, territory });
      }).to.throw(
        "Il est impossible d'acheter une unité : ce dieu ne peut pas vous fournir d'unité."
      );
    });
    it("should throw an exception if there is no more unit to buy", () => {
      // given
      const god = God.Minerve;
      const player = DataTest.player.copy({ gold: 20 });
      // then
      let result;
      result = god.buyUnit({ territory, player });
      result = result.god.buyUnit({
        territory: result.territory,
        player: result.player
      });
      result = result.god.buyUnit({
        territory: result.territory,
        player: result.player
      });
      result = result.god.buyUnit({
        territory: result.territory,
        player: result.player
      });
      expect(() => {
        result = result.god.buyUnit({
          territory: result.territory,
          player: result.player
        });
      }).to.throw(
        "Il est impossible d'acheter une unité : il n'y a plus d'unité à acheter."
      );
    });
    it("should buy 2 gladiator units", () => {
      // given
      const god = God.Pluton.copy({ index: 0 });
      // then
      let result;
      result = god.buyUnit({ player, territory });
      result = result.god.buyUnit({
        territory: result.territory,
        player: result.player
      });
      expect(() => {
        result = result.god.buyUnit({
          territory: result.territory,
          player: result.player
        });
      }).to.throw(
        "Il est impossible d'acheter une unité : il n'y a plus d'unité à acheter."
      );
    });
    it("should buy an gladiator unit and then throw an exception", () => {
      // given
      const god = God.Pluton.copy({ index: 1 });
      // then
      let result;
      result = god.buyUnit({ player, territory });
      expect(() => {
        result = result.god.buyUnit({
          territory: result.territory,
          player: result.player
        });
      }).to.throw(
        "Il est impossible d'acheter une unité : il n'y a plus d'unité à acheter."
      );
    });
    it("should throw an exception if the player does not own the territory", () => {
      // given
      const god = God.Minerve;
      const territory = DataTest.territory;
      // when
      expect(() => {
        god.buyUnit({ player, territory });
      }).to.throw(
        "Il est impossible d'acheter une unité : vous ne pouvez acheter des unités terrestres que sur des territoires que vous contrôlez"
      );
    });
  });
  describe("buyGodCard method", function() {
    it("should buy a card", function() {
      // given
      const god = God.Jupiter;
      // when
      const result = god.buyGodCard({ player });
      // then
      expect(result.player.cards.priest).to.equal(1);
    });
    it("should throw an exception the player does not have enough gold", function() {
      // given
      const god = God.Jupiter;
      const player = DataTest.player.copy({ gold: 1 });
      // then
      const result = god.buyGodCard({ player });
      expect(function() {
        result.god.buyGodCard({ player: result.player });
      }).to.throw(
        "Il est impossible d'acheter une carte : vous n'avez pas assez de sesterces. Cette action coûte 4 sesterce(s)."
      );
    });
    it("should throw an exception if the god cannot give cards", function() {
      // then
      expect(function() {
        God.Minerve.buyGodCard({ player });
      }).to.throw(
        "Il est impossible d'acheter une carte : ce dieu ne peut pas vous fournir de carte."
      );
    });
    it("should throw an exception if there is no more card to buy", function() {
      // given
      const god = God.Junon;
      const player = DataTest.player.copy({ gold: 20 });
      // then
      let result;
      result = god.buyGodCard({ player });
      result = result.god.buyGodCard({ player: result.player });
      expect(function() {
        result = result.god.buyGodCard({ player: result.player });
      }).to.throw(
        "Il est impossible d'acheter une carte : il n'y a plus de carte à acheter."
      );
    });
  });
});
