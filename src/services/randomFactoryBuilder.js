var Arrays = require("rauricoste-arrays");
var StateSync = require("../model/tools/StateSync");
var logger = require("../alias/Logger").getLogger("randomFactoryBuilder");

function randomFactoryBuilder(qPlus, randomSocket, hashService) {
  if (randomSocket) {
    var hashesMap = {};
    var generatedMap = {};
    var deferMap = {};

    var hashSync = new StateSync(randomSocket.hashSocket);
    hashSync.syncListener(function(id, size, randomAsk) {
      var generated = service.generateLocal(randomAsk.number);
      generatedMap[id] = generated;
      deferMap[id] = qPlus.defer();
      logger.debug(id, "create defer from start fct");
      hashSync.send(id, size, {hash: generated.hash, number: randomAsk.number});
    }, function(stored) {
      logger.debug(stored.id, "received all hashes", stored.values);
      hashesMap[stored.id] = stored.values;
      valueSync.send(stored.id, stored.size, generatedMap[stored.id]);
    });

    var valueSync = new StateSync(randomSocket.valueSocket);
    valueSync.syncListener(function(id, size, randomValue) {
    }, function(stored) {
      logger.debug(stored.id, "received all values", stored.values);
      Object.keys(stored.values).map(function(source) {
        var randomValue = stored.values[source];
        var storedHash = hashesMap[stored.id][source].hash;
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
      delete hashesMap[stored.id];
      delete generatedMap[stored.id];
      deferMap[stored.id].resolve(randoms);
    });
  }

  var service = {
    generateLocal: function(number) {
      var self = this;
      var values = Arrays.seq(0, number).map(function() {
        return Math.random();
      });
      var salt = Math.random();
      return {
        values: values,
        salt: salt,
        hash: hashService(salt+""+values)
      }
    },
    generate: function(number, networkSize, id) {
      logger.debug("generate", number, id);
      var self = this;
      this.idCount++;
      if (!id) {
        id = this.globalId+"_"+this.idCount;
      }
      if (!networkSize) {
        networkSize = self.networkSize;
      }
      var defer = deferMap[id];
      if (defer) {
        //delete deferMap[id]; // might be useful later
        return defer.promise;
      }
      defer = qPlus.defer();
      deferMap[id] = defer;
      logger.debug(id, "created defer");
      var generated = this.generateLocal(number);
      generatedMap[id] = generated;
      hashSync.send(id, networkSize, {hash: generated.hash, number: number});
      return defer.promise;
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
    },
    setNetworkSize: function(size) {
      this.networkSize = size;
    },
    setGlobalId: function(id) {
      this.globalId = id;
      this.idCount = 0;
    }
  }
  service.setGlobalId("init");
  return service;
}

module.exports = randomFactoryBuilder;
