var RandomReaderAsync = require("./RandomReaderAsync");

var randomReader = require("rauricoste-random").zero;
var randomReaderAsync = RandomReaderAsync(randomReader);

describe("RandomReaderAsync", function() {
  it("should expose all methods as promises", function(done) {
    randomReaderAsync.nextString("abc", 5).then(function(string) {
      expect(string).to.equal("aaaaa");
      done();
    }).catch(done);
  })
})
