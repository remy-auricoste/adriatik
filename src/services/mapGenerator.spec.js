const mapGenerator = require("./mapGenerator");

describe("mapGenerator", () => {
  const service = mapGenerator;

  describe("getSegments method", () => {
    it("should return a list of segments from a list of points", () => {
      const points = [[0, 0], [0, 1], [0, 2]];
      expect(service.getSegments(points)).to.deep.equal([
        [[0, 0], [0, 1]],
        [[0, 1], [0, 2]],
        [[0, 0], [0, 2]]
      ]);
    });
  });

  describe("removeDuplicates method", () => {
    it("should remove duplicates", () => {
      const segments = [
        [[0, 0], [0, 1]],
        [[0, 1], [0, 2]],
        [[0, 1], [0, 2]],
        [[0, 2], [0, 3]]
      ];
      expect(service.removeDuplicates(segments)).to.deep.equal([
        [[0, 0], [0, 1]],
        [[0, 2], [0, 3]]
      ]);
    });
    it("should remove duplicates (first in double)", () => {
      const segments = [
        [[0, 0], [0, 1]],
        [[0, 0], [0, 1]],
        [[0, 1], [0, 2]],
        [[0, 1], [0, 2]],
        [[0, 2], [0, 3]]
      ];
      expect(service.removeDuplicates(segments)).to.deep.equal([
        [[0, 2], [0, 3]]
      ]);
    });
  });

  describe("getAroundLine method", () => {
    it("should return the around line", () => {
      const segments = [[[0, 0], [0, 1]], [[0, 1], [0, 2]], [[0, 2], [0, 3]]];
      expect(service.getAroundLine(segments)).to.deep.equal([
        [0, 0],
        [0, 1],
        [0, 2],
        [0, 3]
      ]);
    });
  });
});
