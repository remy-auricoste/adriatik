const Arrays = require("rauricoste-arrays");
const hashService = require("./hashService");
const randomSocketMock = require("./randomSocket.mock");
const randomFactoryBuilder = require("./randomFactoryBuilder");

const randomFactory = randomFactoryBuilder(randomSocketMock, hashService);
const logger = require("../alias/Logger").getLogger("randomFactory.spec");

describe.skip("random factory object", function() {
  const random = randomFactory;

  describe("multiRandom method", function() {
    it("should be able to build objects with unique instance with the same primary key", function() {
      const sample = function(generator) {
        const results = {};
        for (let i = 0; i < 10000; i++) {
          const number = generator();
          const bucketName = Math.floor(number * 100) / 100;
          if (!(bucketName in results)) {
            results[bucketName] = 0;
          }
          results[bucketName]++;
        }
        return results;
      };

      const randomNumbers = function() {
        const randoms = Arrays.seq(0, 4).map(() => {
          return Math.random();
        });
        return random.multRandom(randoms);
      };
      const buckets = sample(randomNumbers);
      Object.keys(buckets)
        .sort(function(a, b) {
          return buckets[a] - buckets[b];
        })
        .map(function(bucketKey) {
          logger.debug(bucketKey, buckets[bucketKey]);
        });
    });
  });

  describe("generate method", function() {
    it("should return a distributed random array", function(done) {
      const arrayLength = 2;
      const networkNodes = 3;
      const id = "myId";
      const result = randomFactory.generate(arrayLength, networkNodes, id);
      const values2 = [0.1, 0.2];
      const randomObj2 = {
        values: values2,
        salt: "salt2",
        hash: hashService("salt2" + values2)
      };
      const values3 = [0.5, 0.9];
      const randomObj3 = {
        values: values3,
        salt: "salt3",
        hash: hashService("salt3" + values3)
      };
      randomSocketMock.hashSocket.mockReceive("source2", {
        id: id,
        size: networkNodes,
        value: { hash: randomObj2.hash }
      });
      randomSocketMock.hashSocket.mockReceive("source3", {
        id: id,
        size: networkNodes,
        value: { hash: randomObj3.hash }
      });
      randomSocketMock.valueSocket.mockReceive("source2", {
        id: id,
        size: networkNodes,
        value: randomObj2
      });
      randomSocketMock.valueSocket.mockReceive("source3", {
        id: id,
        size: networkNodes,
        value: randomObj3
      });

      return result
        .then(function(result) {
          logger.debug(result);
          expect(result.constructor).to.equal(Array);
          expect(result.length).to.equal(arrayLength);
          result.forEach(function(value) {
            expect(0 <= value && value <= 1).to.equal(true);
          });
          done();
        })
        .catch(function(err) {
          console.error(err);
          done(err);
        });
    });
  });
});
