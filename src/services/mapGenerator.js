var Meta = require("../alias/Meta");

var tileSize = 60;
var distEpsilon = 0.5;

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
          var tile = new Tile(id, code, [tileIndex, lineIndex]);
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
  getTilePoints: function(position) {
    var xSize = tileSize;
    var ySize = tileSize * 2 / Math.sqrt(3);
    var yStep = ySize / 4;
    var xStep = xSize / 2;
    var pixelPos = [position[0] * xSize, position[1] * (yStep*3)];
    if (position[1] % 2 === 1) {
      pixelPos[0] += xStep;
    }
    return [
      pixelPos.addVector([xStep, 0]),
      pixelPos.addVector([0, yStep]),
      pixelPos.addVector([0, yStep*3]),
      pixelPos.addVector([xStep, yStep*4]),
      pixelPos.addVector([xStep*2, yStep*3]),
      pixelPos.addVector([xStep*2, yStep])
    ]
  },
  getSegments: function(points) {
    return points.map(function(point, index) {
      var nextIndex = (index + 1) % points.length;
      return [point, points[nextIndex]].sort(function(a,b) {
        return a[0] < b[0] ? -1 : (a[0] > b[0] ? 1 : (a[1] < b[1] ? -1 : 1));
      });
    });
  },
  getAroundLine: function(segments) {
    segments = segments.concat([]);
    var self = this;
    var line = segments.splice(0, 1)[0].concat([]);
    while(segments.length) {
      var lastPoint = line[line.length - 1];
      var segmentIndex = Meta.findIndex(segments, function(segment) {
        return Meta.find(segment, function(point, index) {
          return point.distance(lastPoint) < distEpsilon;
        });
      });
      var segment = segments[segmentIndex];
      !segment && console.error("could not find segment", lastPoint, line, segments);
      var nextPoint = Meta.find(segment, function(point) {
        return point.distance(lastPoint) > distEpsilon;
      });
      !nextPoint && console.error("could not find next point", lastPoint, segment);
      line.push(nextPoint);
      segments.splice(segmentIndex, 1);
    }
    return line;
  },
  removeDuplicates: function(segments) {
    segments = segments.concat([]);
    var self = this;
    var result = [segments[0]];
    segments.splice(0, 1);
    segments.forEach(function(segment) {
      var isNew = Meta.forall(result, function(otherSegment) {
        var dists = segment.map(function(point, index) {
          return point.distance(otherSegment[index]);
        });
        return dists.sum() > distEpsilon;
      });
      if (isNew) {
        result.push(segment);
      } else {
        var found = Meta.findIndex(result, function(otherSegment) {
          var dists = segment.map(function(point, index) {
            return point.distance(otherSegment[index]);
          });
          return dists.sum() < distEpsilon;
        });
        if (found >=0) {
          result.splice(found, 1);
        }
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
        var segments = block.flatMap(function(tile) {
          return self.getSegments(self.getTilePoints(tile.pos));
        });
        segments = self.removeDuplicates(segments);
        var points = self.getAroundLine(segments);
        var contents = points.map(function(point) {
          return point[0]+","+point[1];
        })
        var pathValue = "M"+contents.join(",")+"Z";

        var territory = new Territory({
          type: block[0].id !== "1" ? "earth" : "sea",
          path: pathValue
        });
        if (territory.type === "earth") {
          territory.buildSlots = Math.min(4, block.length);
          territory.income = 4 - territory.buildSlots;
        }
        territory.box = Raphael.pathBBox(pathValue);
        return territory;
      });
    });
  }

};

module.exports = service;
