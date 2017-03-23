var Player = require("../model/data/Player");

describe('models classes', function () {
  describe("<class>.fromObject method", function() {
    it('should be able to build objects with unique instance with the same primary key', function() {
      var player = new Player();
      var parsedPlayer = JSON.parse(JSON.stringify(player));
      var instance1 = new Player(parsedPlayer);
      var instance2 = new Player(parsedPlayer);
      expect(!!instance1).to.equal(true);
      expect(!!instance1.constructor.prototype.build).to.equal(true);
      expect(instance2).to.deep.equal(instance1);
      expect(instance2).not.to.equal(instance1);
    });
  });
});
