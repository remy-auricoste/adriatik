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
                  var territory = new Territory({
                    type: "earth",
                    buildSlots: 2
                  });
                  scope.game.territories.push(territory);
                  return new GraphicTerritory({
                    territory: territory,
                    id: territory.id,
                    path: pathValue,
                    box: Raphael.pathBBox(pathValue)
                  });
                });
                scope.paths = paths;
                var boxes = {};
                paths.map(function(path) {
                  boxes[path.territory.id] = path.box;
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
                    return path.territory.id === id;
                  });
                  path.neighbour = true;
                })
              }
              scope.onMouseOut = function(path) {
                path.over = false;
                path.territory.neighbours.map(function(id) {
                  var path = Meta.find(scope.paths, function(path) {
                    return path.territory.id === id;
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
              scope.toggleUnit = function(unit) {
                unit.selected = !unit.selected;
              }
            }
        };
}

angular.module("adriatik").directive("france", france);
