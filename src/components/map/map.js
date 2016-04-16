var Territory = require("../../model/data/Territory");
var Phases = require("../../model/data/Phases");
var CommandType = require("../../model/data/CommandType");
var Command = require("../../model/data/Command");

/** @ngInject */
function map($rootScope) {
    'use strict';

    return {
        restrict: 'E',
        templateUrl: "components/map/map.html",
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
                if (scope.game.turn === 1 && scope.game.phase === Phases.actions && !$rootScope.mode) {
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
                } else if($rootScope.mode && $rootScope.mode.constructor === CommandType) {
                    command = new Command({
                        type: $rootScope.mode,
                        player: scope.game.currentPlayer,
                        args: [territory]
                    });
                } else {
                  $rootScope.$emit("select", territory);
                }
                if (command) {
                  $rootScope.$emit("command", command);
                }
            }
            scope.toggleUnit = function (unit) {
                unit.selected = !unit.selected;
                $rootScope.selectedUnits = Meta.flatten(scope.game.territories.map(function(territory) {
                  return territory.units.filter(function(unit) {
                    return unit.selected;
                  });
                }));
            }
        }
    };
}

angular.module("adriatik").directive("map", map);
