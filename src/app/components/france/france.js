/** @ngInject */
function france($http, $rootScope) {
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
                  return {
                    territory: new Territory(),
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
              });

              scope.onMouseOver = function(event, path) {
                path.over = true;
              }
              scope.onMouseOut = function(path) {
                path.over = false;
              }

              scope.onClick = function(path) {
                if (!$rootScope.mode) {
                  return;
                }
                switch ($rootScope.mode.name) {
                  case CommandType.Build.name:
                    scope.game.currentPlayer.build(path.territory);
                    break;
                  case CommandType.BuyUnit.name:
                    scope.game.currentPlayer.buy
                  default:
                    throw new Error("unsupported command : "+JSON.stringify($rootScope.mode));
                }
                // TODO handle other commands
//                path.units.push({
//                  unit: new Unit({
//                    type: UnitType.Troup,
//                    owner: scope.game.currentPlayer
//                  }),
//                  selected: false
//                });
              }
              scope.toggleTroup = function(troup) {
                troup.selected = !troup.selected;
              }
              scope.troups = function() {
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
