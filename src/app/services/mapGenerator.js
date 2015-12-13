/** @ngInject */
function mapGenerator($http) {
  'use strict';
  var tileSize = 60;

  var service = {
    getTiles: function(name) {
      return $http.get("/app/maps/"+name+".txt").then(function (res) {
        var content = res.data;

        var lastLine = null;
        var matrix = content.split("\n").map(function(line, lineIndex) {
          var lastTile = null;
          var tileLine = line.trim().split(" ").map(function(code, tileIndex) {
            if (code === "0" || !code || !code.length) {
              return null;
            }
            var id = code;
            if (code === "1") {
              code = Math.random()+"";
            }
            var tile = new Tile(id, code, {x: tileIndex, y: lineIndex});
            if (lastTile) {
              lastTile.nextTo(tile);
            }
            lastTile = tile;
            return tile;
          });
          tileLine = tileLine.filter(function(tile) {
            return !!tile;
          });
          if (lastLine) {
            var modifier = lineIndex % 2 === 0 ? -1 : 0;
            tileLine.map(function(tile, tileIndex) {
              Array.seq(0, 1).map(function(value) {
                var otherTile = lastLine[tileIndex + value + modifier];
                if (otherTile) {
                  otherTile.nextTo(tile);
                }
              })
            })
          }
          lastLine = tileLine;
          return tileLine;
        });


        var tiles = Meta.flatten(matrix);
        return tiles;
      });
    },
    getTilePoints: function(pos) {
      var xSize = tileSize;
      var ySize = tileSize * 2 / Math.sqrt(3);
      var yStep = ySize / 4;
      var xStep = xSize / 2;
      var pixelPos = {x: pos.x * xSize, y: pos.y * (yStep*3)};
      if (pos.y % 2 === 1) {
        pixelPos.x += xStep;
      }
      return [
        {x: pixelPos.x+xStep, y: pixelPos.y},
        {x: pixelPos.x, y: pixelPos.y+yStep},
        {x: pixelPos.x, y: pixelPos.y+yStep*3},
        {x: pixelPos.x+xStep, y: pixelPos.y+yStep*4},
        {x: pixelPos.x+xStep*2, y: pixelPos.y+yStep*3},
        {x: pixelPos.x+xStep*2, y: pixelPos.y+yStep}
      ]
    },
    distance: function(point1, point2) {
      var diffX = point1.x - point2.x;
      var diffY = point1.y - point2.y;
      return Math.sqrt(diffX * diffX + diffY * diffY);
    },
    getAroundLine: function(points) {
      var self = this;
      var xs = points.map(function(point) {return point.x});
      var ys = points.map(function(point) {return point.y});
      var barycentre = {x: xs.mean(), y: ys.mean()};
      var line = [];
      while (points.length) {
        var lastPoint = line[line.length - 1];
        points.sort(function(a, b) {
          var distA = lastPoint ? self.distance(a, lastPoint) : 0;
          var distB = lastPoint ? self.distance(b, lastPoint) : 0;
          if (Math.abs(distA - distB) <= 3) {
            var distA2 = self.distance(a, barycentre);
            var distB2 = self.distance(b, barycentre);
            return distA2 < distB2 ? 1 : -1;
          } else {
            return distA < distB ? -1 : 1;
          }
        });
        line.push(points[0]);
        points.splice(0, 1);
      }
      return line;
    },
    removeDuplicates: function(points) {
      var self = this;
      var result = [points[0]];
      points.splice(0, 1);
      points.forEach(function(point) {
        var isNew = Meta.forall(result, function(otherPoint) {
          var dist = self.distance(point, otherPoint);
          return dist > 5;
        });
        if (isNew) {
          result.push(point);
        }
      });
      return result;
    },
    getTerritories: function(name) {
      var self = this;
      return this.getTiles(name).then(function(tiles) {
        var blocks = {};
        tiles.map(function(tile) {
          if (!blocks[tile.code]) {
            blocks[tile.code] = tile.getBlock();
          }
        });
        return Object.keys(blocks).map(function(key) {
          var block = blocks[key];
          var points = Meta.flatten(block.map(function(tile) {
            return self.getTilePoints(tile.pos);
          }));
          points = self.removeDuplicates(points);
          points = self.getAroundLine(points);
          var contents = points.map(function(point) {
            return point.x+","+point.y;
          })
          var pathValue = "M"+contents.join(",")+"Z";

          var territory = new Territory({
            type: block[0].id !== "1" ? "earth" : "sea",
            buildSlots: Math.max(4, block.length + 1),
            path: pathValue
          });
          territory.box = Raphael.pathBBox(pathValue);
          return territory;
        });
      });
    }

  };
//  service.getMap("standard");
  return service;
}
angular.module("adriatik").service("mapGenerator", mapGenerator);


