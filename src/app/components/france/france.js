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

              scope.onMouseOver = function(event, path) {
                var element = event.srcElement;
                var box = Raphael.pathBBox(path.d);
                // it is buggy : cf http://stackoverflow.com/questions/16377186/how-to-get-bounding-box-or-rect-getbbox-for-svg-path-in-jquery
                scope.box = box;
                path.over = true;
              }
              scope.onMouseOut = function(path) {
                path.over = false;
              }
              scope.onClick = function(path) {
                path.color = colors[randomInt(0, colors.length - 1)];
              }
              var droppedPath;
              scope.onPress = function(path) {
                droppedPath = path;
              }
              scope.onRelease = function(path) {
                path.color = droppedPath.color;
                delete droppedPath.color;
              }
            }
        };
}

angular.module("adriatik").directive("france", france);
