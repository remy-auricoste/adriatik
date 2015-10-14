/** @ngInject */
function france($http) {
    'use strict';

        return {
            restrict: 'E',
            templateUrl: "app/components/france/france.html",
            replace: true,
            scope: {
              game: "="
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

              scope.onMouseOver = function(event, path) {
                path.over = true;
              }
              scope.onMouseOut = function(path) {
                path.over = false;
              }

              scope.troups = [];
              scope.onClick = function(path) {
                var box = Raphael.pathBBox(path.d);
                scope.troups.push({
                  unit: new Unit({
                    type: UnitType.Troup,
                    owner: scope.game.currentPlayer
                  }),
                  left: Math.round(box.x + (box.width-20) / 2),
                  top: Math.round(box.y + (box.height-20) / 2)
                });
              }
              scope.toggleTroup = function(troup) {
                troup.selected = !troup.selected;
              }

//              var droppedPath;
//              scope.onPress = function(path) {
//                droppedPath = path;
//              }
//              scope.onRelease = function(path) {
//                path.color = droppedPath.color;
//                delete droppedPath.color;
//              }
            }
        };
}

angular.module("adriatik").directive("france", france);
