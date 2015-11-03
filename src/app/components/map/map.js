/** @ngInject */
function map($http, $rootScope) {
    'use strict';

    return {
        restrict: 'E',
        templateUrl: "app/components/map/map.html",
        replace: true,
        scope: {
            game: "="
        },
        link: function (scope) {
            scope.unitSize = 20;

            scope.onMouseOver = function (event, territory) {
                territory.over = true;
                territory.neighbours.map(function (id) {
                    var neighbour = Territory.byId(id);
                    neighbour.isNeighbour = true;
                })
            }
            scope.onMouseOut = function (territory) {
                territory.over = false;
                territory.neighbours.map(function (id) {
                    var neighbour = Territory.byId(id);
                    neighbour.isNeighbour = false;
                })
            }

            scope.onClick = function (territory) {
                var command;
                if (scope.game.turn === 1) {
                    var hasMoreUnits = scope.game.initHasMoreUnits(scope.game.currentPlayer);
                    var commandType = hasMoreUnits ? CommandType.InitUnit : CommandType.InitBuilding;
                    var args = hasMoreUnits ? [territory] : [territory, scope.game.currentPlayer.god.building];
                    command = new Command({
                        type: commandType,
                        player: scope.game.currentPlayer,
                        args: args
                    })
                } else if (!$rootScope.mode) {
                    var fromTerritory;
                    var selectedUnits = Meta.flatten(scope.game.territories.map(function (territory) {
                        var units = territory.units.filter(function (unit) {
                            return unit.selected;
                        });
                        if (units.length) {
                            fromTerritory = territory;
                        }
                        return units;
                    }));
                    if (selectedUnits.length && fromTerritory) {
                        command = new Command({
                            type: CommandType.Move,
                            player: scope.game.currentPlayer,
                            args: [selectedUnits, fromTerritory, territory]
                        });
                    }
                } else {
                    command = new Command({
                        type: $rootScope.mode,
                        player: scope.game.currentPlayer,
                        args: [territory]
                    });
                }
                if (command) {
                    command.callback = function(result) {
                      if (result !== undefined && typeof result.then === "function") {
                          result.then(function (battleResult) {
                              console.log("battle result", battleResult);
                          }).catch(function (err) {
                              console.error("error");
                              console.error(err);
                          });
                      }
                    }
                    $rootScope.$emit("command", command);
                }
            }
            scope.toggleUnit = function (unit) {
                unit.selected = !unit.selected;
            }
        }
    };
}

angular.module("adriatik").directive("map", map);
