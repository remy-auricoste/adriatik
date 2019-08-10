const { SelectionActions, DataTest } = injector.resolveAll();

const { territory } = DataTest;

describe("SelectionActions class", () => {
  describe("isSelectionReady method", () => {
    it("should return false", () => {
      expect(SelectionActions.isSelectionReady()).to.equal(false);
      expect(SelectionActions.isSelectionReady({})).to.equal(false);
      expect(SelectionActions.isSelectionReady({ args: [] })).to.equal(false);
      expect(SelectionActions.isSelectionReady({ args: [territory] })).to.equal(
        false
      );
      expect(
        SelectionActions.isSelectionReady({ actionType: "build" })
      ).to.equal(false);
      expect(
        SelectionActions.isSelectionReady({ actionType: "build", args: [] })
      ).to.equal(false);
    });
    it("should return true", () => {
      expect(
        SelectionActions.isSelectionReady({ actionType: "buyGodCard" })
      ).to.equal(true);
      expect(
        SelectionActions.isSelectionReady({
          actionType: "buyGodCard",
          args: []
        })
      ).to.equal(true);
      expect(
        SelectionActions.isSelectionReady({
          actionType: "build",
          args: [territory]
        })
      ).to.equal(true);
      expect(
        SelectionActions.isSelectionReady({
          actionType: "buyUnit",
          args: [territory]
        })
      ).to.equal(true);
    });
  });
});
