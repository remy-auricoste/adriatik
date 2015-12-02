'use strict';

angular.module('angular-md5', [])

describe('random factory object', function () {
  beforeEach(module('angular-md5'));

  var random = randomFactory();

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
});
