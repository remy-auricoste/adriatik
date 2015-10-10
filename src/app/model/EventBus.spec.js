'use strict';

describe('EventBus class', function () {
  beforeEach(function () {
  });

  describe("emit method", function() {
    it('should emit message to all listeners', function() {
      EventBus.addListener("test", function(messageObj) {
        expect(messageObj.emitter).toBe("me");
        expect(messageObj.channel).toBe("test");
        expect(messageObj.message).toBe("hello");
      });
      EventBus.emit("plop", "me", "not the good message");
      EventBus.emit("test", "me", "hello");
    });
  });
});
