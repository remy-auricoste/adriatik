(function () {
    'use strict';

    angular
        .module('adriatik')
        .config(config);

    /** @ngInject */
    function config($logProvider, $locationProvider) {
        // Enable log
        $logProvider.debugEnabled(true);

        // if activated, replace /#/... routes by removing /#. Not interesting if reload does not work.
        //$locationProvider.html5Mode(true);
    }

})();
