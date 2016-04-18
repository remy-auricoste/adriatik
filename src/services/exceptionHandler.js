var exceptionHandler = function(exception, cause) {
  exceptionHandler.listeners.map(function(listener) {
    listener(exception);
  });
  console.error(exception);
};
exceptionHandler.listeners = [];
exceptionHandler.$onError = function(fonction) {
  exceptionHandler.listeners.push(fonction);
}


angular.module('adriatik').factory('$exceptionHandler', function() {return exceptionHandler});

module.exports = exceptionHandler;
