const { mapGenerator } = injector.resolveAll();

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

  describe("getTiles method", () => {
    it("should build a tile board from a template", () => {
      const template = `
        0 1 1
         1 2 2
        0 1 1
      `;
      const tiles = service.getTiles(template);
      expect(tiles.length).to.equal(7);
      expect(tiles).to.deep.equal([
        {
          pos: { x: 1, y: 0 },
          code: 1,
          id: 1,
          neighbours: [2, 3, 4]
        },
        {
          pos: { x: 2, y: 0 },
          id: 2,
          code: 1,
          neighbours: [1, 4, 5]
        },
        {
          pos: { x: 0.5, y: 1 },
          id: 3,
          code: 1,
          neighbours: [1, 4, 7]
        },
        {
          pos: { x: 1.5, y: 1 },
          id: 4,
          code: 2,
          neighbours: [1, 2, 3, 5, 7, 8]
        },
        {
          pos: { x: 2.5, y: 1 },
          id: 5,
          code: 2,
          neighbours: [2, 4, 8]
        },
        {
          pos: { x: 1, y: 2 },
          id: 7,
          code: 1,
          neighbours: [3, 4, 8]
        },
        {
          pos: { x: 2, y: 2 },
          id: 8,
          code: 1,
          neighbours: [4, 5, 7]
        }
      ]);
    });
  });
  describe("getBlocks method", () => {
    it("should build blocks from a template", () => {
      const template = `
        0 3 3
         1 2 2
        0 1 2
      `;
      const blocks = service.getBlocks(template);
      expect(blocks).to.deep.equal([
        {
          tiles: [{ x: 1, y: 2 }],
          code: 1,
          id: 0,
          neighbours: [1, 2]
        },
        {
          tiles: [{ x: 0.5, y: 1 }],
          code: 1,
          id: 1,
          neighbours: [0, 2, 3]
        },
        {
          tiles: [{ x: 1.5, y: 1 }, { x: 2.5, y: 1 }, { x: 2, y: 2 }],
          code: 2,
          id: 2,
          neighbours: [0, 1, 3]
        },
        {
          tiles: [{ x: 1, y: 0 }, { x: 2, y: 0 }],
          code: 3,
          id: 3,
          neighbours: [1, 2]
        }
      ]);
    });
  });
  describe("getTilePoints", () => {
    it("should return the points of an hexagon", () => {
      expect(service.getTilePoints([0, 0])).to.deep.equal([
        [45, 0],
        [0, 25.98076211353316],
        [0, 77.94228634059948],
        [45, 103.92304845413264],
        [90, 77.94228634059948],
        [90, 25.98076211353316]
      ]);
    });
  });
});
