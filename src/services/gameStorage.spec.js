var expect = require("../alias/Expect");

describe('models classes', function () {
  beforeEach(function () {
  });

  describe("<class>.fromObject method", function() {
    it('should be able to build objects with unique instance with the same primary key', function() {
      var player = new Player();
      var parsedPlayer = JSON.parse(JSON.stringify(player));
      var instance1 = Player.fromObject(parsedPlayer);
      var instance2 = Player.fromObject(parsedPlayer);
      expect(!!instance1).to.equal(true);
      expect(!!instance1.constructor.prototype.build).to.equal(true);
      expect(instance2).to.equal(instance1);
    });
  });
});
