'use strict';

describe('mapGenerator', function () {
  beforeEach(function () {
  });

  var service = mapGenerator();

  describe("getSegments method", function() {
    it('should return a list of segments from a list of points', function() {
      var points = [
        [0, 0],
        [0, 1],
        [0, 2]
      ];
      expect(service.getSegments(points)).toEqual([
        [[0, 0], [0, 1]],
        [[0, 1], [0, 2]],
        [[0, 0], [0, 2]]
      ])
    });
  });

  describe("removeDuplicates method", function() {
    it('should remove duplicates', function() {
      var segments = [
        [[0, 0], [0, 1]],
        [[0, 1], [0, 2]],
        [[0, 1], [0, 2]],
        [[0, 2], [0, 3]]
      ];
      expect(service.removeDuplicates(segments)).toEqual([
         [[0, 0], [0, 1]],
         [[0, 2], [0, 3]]
       ]);
    });
  });

  describe("getAroundLine method", function() {
    it('should return the around line', function() {
      var segments = [
        [[0, 0], [0, 1]],
        [[0, 1], [0, 2]],
        [[0, 2], [0, 3]]
      ];
      expect(service.getAroundLine(segments)).toEqual([
         [0, 0], [0, 1], [0, 2], [0, 3]
       ]);
    });
  });
});
