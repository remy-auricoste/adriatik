/** @ngInject */
function france($http) {
    'use strict';

        return {
            restrict: 'E',
            templateUrl: "app/components/france/france.html",
            replace: true,
            scope: {
            },
            link: function(scope) {
              scope.paths = [];
              $http.get("/app/components/france/departements.txt").then(function(res) {
                var paths = res.data.split("d=\"").filter(function(line) {
                  return line.length > 3;
                }).map(function(line) {
                  var pathValue = line.split("\"")[0];
                  return {
                    d: pathValue,
                    over: false,
                    color: "lightgrey"
                  }
                });
                scope.paths = paths;
              });

              var colors = ["red", "blue", "green", "white"];
              var randomFloat = function(min, max) {
                return Math.random() * (max - min) + min;
              }
              var randomInt = function(min, max) {
                return Math.floor(randomFloat(min, max+1));
              }

              scope.onMouseOver = function(path) {
                path.over = true;
              }
              scope.onMouseOut = function(path) {
                path.over = false;
              }
              scope.onClick = function(path) {
                path.color = colors[randomInt(0, colors.length - 1)];
              }
            }
        };
}

angular.module("adriatik").directive("france", france);
