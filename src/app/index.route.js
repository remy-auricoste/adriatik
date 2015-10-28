(function () {
    'use strict';

    angular
        .module('adriatik')
        .config(routeConfig);

    function routeConfig($routeProvider) {
        $routeProvider
            .when('/search', {template: '<room></room>'})
            .when('/game/:playerSize/:id', {template: '<game></game>'})
            .when('/account', {template: '<account-page></account-page>'})
            .otherwise({
                redirectTo: '/game/1/12312312'
            });
    }

})();
