/** @ngInject */
function qPlus($q) {
    'use strict';

    $q.fcall = function (fonction) {
        var defer = $q.defer();
        try {
            defer.resolve(fonction());
        } catch (err) {
            defer.reject(err);
        }
        return defer.promise;
    }
    $q.empty = function () {
        return $q.fcall(function () {
        });
    }
    $q.value = function(value) {
      return $q.fcall(function() {
        return value;
      });
    }
    return $q;
}

angular.module("adriatik").service("qPlus", qPlus);


