'use strict';

angular.module('angular-md5', [])

describe('random factory object', function () {
  beforeEach(module('angular-md5'));

  var random = randomFactoryInstance;

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
      var result = randomFactoryInstance.generate(arrayLength, networkNodes, id);
      randomSocketMock.hashSocket.mockReceive("source2", {
        id: id,
        size: networkNodes,
        value: {hash: "salt2value2"}
      });
      randomSocketMock.hashSocket.mockReceive("source3", {
        id: id,
        size: networkNodes,
        value: {hash: "salt3value3"}
      });
      randomSocketMock.valueSocket.mockReceive("source2", {
        id: id,
        size: networkNodes,
        value: {hash: "salt2value2", salt: "salt2", values: "value2"}
      });
      randomSocketMock.valueSocket.mockReceive("source3", {
        id: id,
        size: networkNodes,
        value: {hash: "salt3va", salt: "salt3", values: "value3"}
      });

      return result.then(function(result) {
        expect(result.constructor).toBe(Array);
        expect(result.length).toBe(arrayLength);
        result.map(function(value) {
          expect(0 <= value && value <= 1).toBe(true);
        });
        done();
      }).catch(function(err) {
        console.error(err);
      });
    })
  })
});
