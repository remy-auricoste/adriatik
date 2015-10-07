(function() {
  'use strict';

  angular
    .module('adriatik')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
