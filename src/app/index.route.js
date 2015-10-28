(function () {
    'use strict';

    angular
        .module('adriatik')
        .config(routeConfig);

    function routeConfig($routeProvider) {
        $routeProvider
            .when('/', {template: '<game></game>'})
            .when('/search', {template: '<room></room>'})
            .when('/game/:playerSize/:id', {template: '<game></game>'})
            .when('/account', {template: '<account-page></account-page>'})
            .otherwise({
                redirectTo: '/'
            });
    }

})();
