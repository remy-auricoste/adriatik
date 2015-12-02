/** @ngInject */
function randomFactory(qPlus, randomSocket, hashService) {
  'use strict';

  if (randomSocket) {
    var lastHashes = null;
    var lastGenerated = null;
    var lastDefer = null;
    var isAsking = false;

    var hashSync = new StateSync(randomSocket.hashSocket);
    hashSync.syncListener(function(id, size, randomAsk) {
      lastGenerated = service.generateLocal(randomAsk.number);
      hashSync.send(id, size, {hash: lastGenerated.hash});
    }, function(stored) {
      lastHashes = stored.values;
      if (isAsking) {
        valueSync.send(stored.id, stored.size, lastGenerated);
      }
    });

    var valueSync = new StateSync(randomSocket.valueSocket);
    valueSync.syncListener(function(id, size, randomValue) {
    }, function(stored) {
      Object.keys(stored.values).map(function(source) {
        var randomValue = stored.values[source];
        var storedHash = lastHashes[source].hash;
        var calculatedHash = hashService(randomValue.salt+""+randomValue.values);
        if (calculatedHash !== storedHash) {
          throw new Error("received hash "+storedHash+" is not equal to calculated hash "+calculatedHash+" for command "+stored.id+" and socket source "+source);
        }
      });
      var firstKey = Object.keys(stored.values)[0];
      var firstObj = stored.values[firstKey];
      var randoms = firstObj.values.map(function(value, index) {
        var array = Object.keys(stored.values).map(function(key) {
          return stored.values[key].values[index];
        });
        return service.multRandom(array);
      });
      isAsking = false;
      return lastDefer && lastDefer.resolve(randoms);
    });
  }

  var service =  {
    generateLocal: function(number) {
      var self = this;
      var values = Array.seq(1, number).map(function() {
        return Math.random();
      });
      var salt = Math.random();
      return {
        values: values,
        salt: salt,
        hash: hashService(salt+""+values)
      }
    },
    generate: function(number, id, size) {
      var self = this;
      isAsking = true;
      lastDefer = qPlus.defer();
      lastGenerated = this.generateLocal(number);
      hashSync.send(id, size, {hash: lastGenerated.hash});
      return lastDefer.promise;
    },
    shuffle: function (array) {
      return this.generate(array.length).then(function (randoms) {
        // cf http://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array-in-javascript
        var o = array;
        for (var j, x, i = o.length; i; j = Math.floor(randoms[i - 1] * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
      });
    },
    multRandom : function(randomsArray){
      var joined = randomsArray.join("");
      var string = ("" + hashService(joined));
      var cleanedString = string.split('').filter(function (character) {
        return !isNaN(parseInt(character))
      }).join('');
      return parseFloat("0." + cleanedString);
    }
  }

  var path = window.location.pathname;
  if (path.startsWith("/dev/")) {
    service.generate = function(size) {
      return qPlus.value(service.generateLocal(size).values);
    }
  }
  return service;
}

angular.module("adriatik").service("randomFactory", randomFactory);
