/** @ngInject */
function france($http, $rootScope, neighbourFinder) {
    'use strict';

        return {
            restrict: 'E',
            templateUrl: "app/components/france/france.html",
            replace: true,
            scope: {
              game: "="
            },
            link: function(scope) {
              scope.unitSize = 20;

              scope.paths = [];
              $http.get("/app/components/france/departements.json").then(function(res) {
                var paths = res.data;
                paths = paths.map(function(path) {
                  var pathValue = path.d;
                  var territory = new Territory();
                  return {
                    territory: territory,
                    id: territory.id,
                    d: pathValue,
                    over: false,
                    color: "lightgrey",
                    box: Raphael.pathBBox(pathValue),
                    units: [],
                    left: function(index) {
                      return Math.round(this.box.x + (this.box.width-scope.unitSize) / 2);
                    },
                    top: function(index) {
                      return Math.round(this.box.y + (this.box.height-scope.unitSize) / 2);
                    }
                  }
                });
                scope.paths = paths;
                var boxes = {};
                paths.map(function(path) {
                  boxes[path.id] = path.box;
                  path.box.path = path;
                });
                for (var key in boxes) {
                  var box = boxes[key];
                  var neighbours = neighbourFinder.findNeighboursSimple(box, boxes);
                  neighbours.map(function(neighbour) {
                    if (neighbour === key) {
                      return;
                    }
                    boxes[neighbour].path.territory.nextTo(box.path.territory);
                  })
                }
              });

              scope.onMouseOver = function(event, path) {
                path.over = true;
                path.territory.neighbours.map(function(id) {
                  var path = Meta.find(scope.paths, function(path) {
                    return path.id === id;
                  });
                  path.neighbour = true;
                })
              }
              scope.onMouseOut = function(path) {
                path.over = false;
                path.territory.neighbours.map(function(id) {
                  var path = Meta.find(scope.paths, function(path) {
                    return path.id === id;
                  });
                  path.neighbour = false;
                })
              }

              scope.onClick = function(path) {
                if (!$rootScope.mode) {
                  return;
                }
                var command = new Command({
                  type: $rootScope.mode,
                  player: scope.game.currentPlayer,
                  args: [path.territory]
                });
                scope.game.receiveCommand(command);
              }
              scope.toggleTroup = function(troup) {
                troup.selected = !troup.selected;
              }
              scope.troups = function() {
                // TODO use model to display troups
                return Meta.flatten(scope.paths.map(function(path) {
                  return path.units.map(function(troup, index) {
                    troup.left = path.left(index);
                    troup.top = path.top(index);
                    return troup;
                  });
                }));
              }
            }
        };
}

angular.module("adriatik").directive("france", france);
