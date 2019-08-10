const { StoreActions, DataTest } = injector.resolveAll();

const { territory } = DataTest;

describe("StoreActions class", () => {
  describe("isSelectionReady method", () => {
    it("should return false", () => {
      expect(StoreActions.isSelectionReady()).to.equal(false);
      expect(StoreActions.isSelectionReady({})).to.equal(false);
      expect(StoreActions.isSelectionReady({ args: [] })).to.equal(false);
      expect(StoreActions.isSelectionReady({ args: [territory] })).to.equal(
        false
      );
      expect(StoreActions.isSelectionReady({ actionType: "build" })).to.equal(
        false
      );
      expect(
        StoreActions.isSelectionReady({ actionType: "build", args: [] })
      ).to.equal(false);
    });
  });
});
