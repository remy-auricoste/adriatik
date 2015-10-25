/** @ngInject */
function cron() {
  'use strict';

  return function(fonction, interval) {
    function call() {
      window.setTimeout(function() {
        fonction();
        call();
      }, interval);
    }
    call();
  }
}
angular.module("adriatik").service("cron", cron);


