/** @ngInject */
function map($http, $rootScope, neighbourFinder) {
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

            scope.paths = [];
            $http.get("/app/components/map/area.json").then(function (res) {
                var paths = res.data;
                paths = paths.map(function (path) {
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
                paths.map(function (path) {
                    boxes[path.territory.id] = path.box;
                    path.box.path = path;
                });
                for (var key in boxes) {
                    var box = boxes[key];
                    var neighbours = neighbourFinder.findNeighboursSimple(box, boxes);
                    neighbours.map(function (neighbour) {
                        if (neighbour === key) {
                            return;
                        }
                        boxes[neighbour].path.territory.nextTo(box.path.territory);
                    })
                }
            });

            scope.onMouseOver = function (event, path) {
                path.over = true;
                path.territory.neighbours.map(function (id) {
                    var path = Meta.find(scope.paths, function (path) {
                        return path.territory.id === id;
                    });
                    path.neighbour = true;
                })
            }
            scope.onMouseOut = function (path) {
                path.over = false;
                path.territory.neighbours.map(function (id) {
                    var path = Meta.find(scope.paths, function (path) {
                        return path.territory.id === id;
                    });
                    path.neighbour = false;
                })
            }

            scope.onClick = function (path) {
                var command;
                if (scope.game.turn === 1) {
                    var hasMoreUnits = scope.game.initHasMoreUnits(scope.game.currentPlayer);
                    var commandType = hasMoreUnits ? CommandType.InitUnit : CommandType.InitBuilding;
                    var args = hasMoreUnits ? [path.territory] : [path.territory, scope.game.currentPlayer.god.building];
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
                            args: [selectedUnits, fromTerritory, path.territory]
                        });
                    }
                } else {
                    command = new Command({
                        type: $rootScope.mode,
                        player: scope.game.currentPlayer,
                        args: [path.territory]
                    });
                }
                if (command) {
                    var result = scope.game.receiveCommand(command);
                    // TODO command
                    if (result !== undefined && typeof result.then === "function") {
                        result.then(function (battleResult) {
                            console.log("battle result", battleResult);
                        }).catch(function (err) {
                            console.error("error");
                            console.error(err);
                        });
                    }
                }
            }
            scope.toggleUnit = function (unit) {
                unit.selected = !unit.selected;
            }
        }
    };
}

angular.module("adriatik").directive("map", map);
