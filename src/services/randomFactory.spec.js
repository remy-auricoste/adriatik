var expect = require("../alias/Expect");
var randomFactory = require("./randomFactory.mock");
var hashService = require("./hashService");
var randomSocketMock = require("./randomSocket.mock");
var hashService = require("./hashService");
var randomFactoryBuilder = require("./randomFactoryBuilder");
var qPlus = require("./qPlus");

var randomFactory = randomFactoryBuilder(qPlus, randomSocketMock, hashService);

describe('random factory object', function () {
  var random = randomFactory;

  describe("multiRandom method", function() {
    it('should be able to build objects with unique instance with the same primary key', function() {
      var sample = function(generator) {
        var results = {};
        for (var i = 0; i < 10000; i++) {
            var number = generator();
            var bucketName = Math.floor(number * 100) / 100;
            if (!(bucketName in results)) {
              results[bucketName] = 0;
            }
            results[bucketName]++;
        }
        return results;
      };

      var randomNumbers = function() {
        var randoms = Array.seq(1, 4).map(function(index) {
          return Math.random();
        });
        return random.multRandom(randoms);
      };
      var buckets = sample(randomNumbers);
      Object.keys(buckets).sort(function(a,b) {
        return buckets[a] - buckets[b];
      }).map(function(bucketKey) {
        //console.log(bucketKey, buckets[bucketKey])
      });
    });
  });

  describe("generate method", function() {
    it("should return a distributed random array", function(done) {
      var arrayLength = 2;
      var networkNodes = 3;
      var id = "myId";
      var result = randomFactory.generate(arrayLength, networkNodes, id);
      var values2 = [0.1, 0.2];
      var randomObj2 = {
        values: values2,
        salt: "salt2",
        hash: hashService("salt2"+values2)
      }
      var values3 = [0.5, 0.9];
      var randomObj3 = {
        values: values3,
        salt: "salt3",
        hash: hashService("salt3"+values3)
      }
      randomSocketMock.hashSocket.mockReceive("source2", {
        id: id,
        size: networkNodes,
        value: {hash: randomObj2.hash}
      });
      randomSocketMock.hashSocket.mockReceive("source3", {
        id: id,
        size: networkNodes,
        value: {hash: randomObj3.hash}
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

      return result.then(function(result) {
        console.log(result);
        expect(result.constructor).to.equal(Array);
        expect(result.length).to.equal(arrayLength);
        result.map(function(value) {
          expect(0 <= value && value <= 1).to.equal(true);
        });
        done();
      }).catch(function(err) {
        console.error(err);
        done(err);
      });
    })
  })
});
