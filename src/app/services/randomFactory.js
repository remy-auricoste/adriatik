/** @ngInject */
function randomFactory($http, qPlus) {
  'use strict';
  return {
    generate: function(number) {
      return qPlus.fcall(function() {
        var result = [];
        for (var i=0;i<number;i++) {
          result.push(Math.random());
        }
        return result;
      });
    },
    shuffle: function(array) {
      return this.generate(array.length).then(function(randoms) {
        // cf http://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array-in-javascript
        var o = array;
        for(var j, x, i = o.length; i; j = Math.floor(randoms[i-1] * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
      });
    }
  }
}

angular.module("adriatik").service("randomFactory", randomFactory);
