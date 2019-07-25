const RandomReaderAsync = require("./RandomReaderAsync");

const randomReader = require("rauricoste-random").zero;
const randomReaderAsync = RandomReaderAsync(randomReader);

describe("RandomReaderAsync", () => {
  it("should expose all methods as promises", () => {
    return randomReaderAsync.nextString("abc", 5).then(string => {
      expect(string).to.equal("aaaaa");
    });
  });
});
