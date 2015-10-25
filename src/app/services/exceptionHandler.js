/** @ngInject */
function exceptionHandler($log) {
  var result = function(exception, cause) {
    result.listeners.map(function(listener) {
      listener(exception);
    });
    throw exception;
  };
  result.listeners = [];
  result.$onError = function(fonction) {
    result.listeners.push(fonction);
  }
  return result;
}


angular.module('adriatik').factory('$exceptionHandler', exceptionHandler);
