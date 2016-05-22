var Territory = require("../../model/data/Territory");
var Phases = require("../../model/data/Phases");
var CommandType = require("../../model/data/CommandType");
var Command = require("../../model/data/Command");
var commandCenter = require("../../services/commandCenter");

var logger = require("../../alias/Logger").getLogger("map");

/** @ngInject */
function map($rootScope) {
    return {
        restrict: 'E',
        templateUrl: "components/map/map.html",
        replace: true,
        scope: {
            game: "="
        },
        link: function (scope) {
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
                if (scope.hasSelectedUnits() && scope.selection.fromTerritory === territory) {
                  scope.selection.units = scope.selection.units.slice(0, scope.selection.units.length - 1);
                  return;
                }

                var command;
                if (scope.game.turn === 1 && scope.game.phase === Phases.actions && !$rootScope.mode) {
                    var hasMoreUnits = scope.game.initHasMoreUnits(scope.game.currentPlayer);
                    var commandType = hasMoreUnits ? CommandType.InitUnit : CommandType.InitBuilding;
                    var args = hasMoreUnits ? [territory] : [territory, scope.game.currentPlayer.god.building];
                    command = new Command({
                        type: commandType,
                        args: args
                    })
                } else if (!$rootScope.mode) {
                    if (scope.hasSelectedUnits()) {
                        var fromTerritory = scope.selection.fromTerritory;
                        var selectedUnits = scope.selection.units;
                        initSelection();
                        command = new Command({
                            type: CommandType.Move,
                            args: [selectedUnits, fromTerritory, territory]
                        });
                    }
                } else if($rootScope.mode && $rootScope.mode.constructor === CommandType) {
                    command = new Command({
                        type: $rootScope.mode,
                        args: [territory]
                    });
                } else {
                  $rootScope.$emit("select", territory);
                }
                if (command) {
                  commandCenter.send(command);
                }
            }

            var initSelection = function() {
              scope.selection = {
                units: [],
                fromTerritory: {}
              };
            };
            initSelection();
            scope.select = function(counter, territory) {
              if (scope.selection.fromTerritory !== territory) {
                initSelection();
              }
              var unselectedUnits = counter.units.filter(function(unit) {
                return scope.selection.units.indexOf(unit) === -1;
              })
              scope.selection.units.push(unselectedUnits[0]);
              scope.selection.fromTerritory = territory;
            }

            scope.hasSelectedUnits = function() {
              return !!scope.selection.units.length;
            }
            scope.getUnitCounterKeys = function(units) {
              var groups = Meta.groupBy(units, function(unit) {
                return unit.type.name + "_" + unit.owner.color;
              });
              return Object.keys(groups);
            }
            scope.getUnitCounters = function(units) {
              var groups = Meta.groupBy(units, function(unit) {
                return unit.type.name + "_" + unit.owner.color;
              });
              return Object.keys(groups).map(function(key) {
                var units = groups[key];
                return {
                  units: units,
                  color: units.length ? units[0].owner.color : null,
                  unitType: units.length ? units[0].type.name : null,
                  key: key
                }
              });
            }
            scope.getCounter = function(units, key) {
              return scope.getUnitCounters(units).filter(function(counter) {
                return counter.key === key;
              })[0];
            }
            scope.getUnitCount = function(units, key, territory) {
              var unitCount = scope.getCounter(units, key).units.length;
              if (territory === scope.selection.fromTerritory) {
                var selectionCounter = scope.getCounter(scope.selection.units, key);
                unitCount -= selectionCounter ? selectionCounter.units.length : 0;
              }
              return unitCount;
            }
        }
    };
}

angular.module("adriatik").directive("map", map);
