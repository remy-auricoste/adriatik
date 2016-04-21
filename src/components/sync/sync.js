function sync() {
    return {
        restrict: 'E',
        templateUrl: "components/sync/sync.html",
        replace: true,
        scope: {
          game: "="
        },
        link: function (scope, elements, attr) {
        }
    };
}

angular.module("adriatik").directive("sync", sync);
