'use strict';

describe('EventBus class', function () {
  beforeEach(function () {
  });

  describe("emit method", function() {
    it('should emit message to all listeners', function() {
      var count = 0;
      var receiver = function(messageObj) {
       expect(messageObj.emitter).toBe("me");
       expect(messageObj.channel).toBe("test");
       expect(messageObj.message).toBe("hello");
       count++;
      };
      EventBus.addListener("test", receiver);
      EventBus.addListener("test", receiver);

      EventBus.emit("plop", "me", "not the good message");
      EventBus.emit("test", "me", "hello");
      expect(count).toBe(2);
    });
  });
});
