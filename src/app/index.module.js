(function () {
    'use strict';

    angular
        .module('adriatik', ['ngTouch', 'ngResource', 'ngRoute', 'ui.bootstrap', 'angular-md5', 'ngMd5', 'gdi2290.md5'])
        .filter('range', function() {
            return function(input, total) {
                total = parseInt(total);

                for (var i=0; i<total; i++) {
                    input.push(i);
                }

                return input;
            };
        });

})();
