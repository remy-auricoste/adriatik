describe('Arrays', function () {
  beforeEach(function () {
  });

  describe("distance method", function() {
    it('should the distance between 2 vectors', function() {
      expect([1, 1].distance([1, 3])).to.equal(2);
    });
  });

  describe("addVector method", function() {
    it('should add the vector', function() {
      expect([1, 1].addVector([1, 3])).to.deep.equal([2, 4]);
    });
  });

  describe("minusVector method", function() {
    it('should substract the vector', function() {
      expect([1, 1].minusVector([1, 3])).to.deep.equal([0, -2]);
    });
  });

  describe("norm method", function() {
    it('should return the norm of the vector', function() {
      expect([0, 5].norm()).to.equal(5);
    });
  });

  describe("mult method", function() {
    it('should multiply the vector by a factor', function() {
      expect([1, 5].mult(3)).to.deep.equal([3, 15]);
    });
  });
});

