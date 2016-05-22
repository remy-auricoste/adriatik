function mapCounter() {
    return {
        restrict: 'E',
        templateUrl: "components/map/mapCounter.html",
        replace: true,
        scope: {
            value: "=",
            fileName: "@"
        },
        link: function (scope) {
        }
    };
}

angular.module("adriatik").directive("mapCounter", mapCounter);
