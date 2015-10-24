(function () {
    'use strict';

    angular
        .module('adriatik')
        .config(routeConfig);

    function routeConfig($routeProvider) {
        $routeProvider
            .when('/', {template: '<game></game>'})
            .when('/search', {template: '<room></room>'})
            .when('/game/:id', {template: '<game></game>'})
            .otherwise({
                redirectTo: '/'
            });
    }

})();
