var tileSize = 90;
var distEpsilon = 0.5;

var minFct = (a, b) => {
  return Math.min(a, b);
};
var maxFct = (a, b) => {
  return Math.max(a, b);
};
const sum = array => {
  return array.reduce((acc, value) => acc + value, 0);
};

const PointPrototype = [];
Object.assign(PointPrototype, {
  plus([a, b]) {
    const [x, y] = this;
    return new Point([x + a, y + b]);
  },
  factor(number) {
    const [x, y] = this;
    return new Point([x * number, y * number]);
  },
  minus(point) {
    return this.plus(point.factor(-1));
  },
  distance(point) {
    return point.minus(this).norm();
  },
  norm() {
    const [x, y] = this;
    return Math.sqrt(x * x + y * y);
  }
});
Object.assign(Array.prototype, PointPrototype);

class Point {
  constructor(array = [0, 0]) {
    return array;
  }
}

module.exports = function(Arrays, Request, Tile) {
  class MapGenerator {
    getTiles(name) {
      return new Request().get("/maps/" + name + ".txt").then(function(res) {
        var content = res.body;

        var lastLine = null;
        var lines = content.split("\n");
        var tiles = Arrays.flatMap(lines, function(line, lineIndex) {
          var lastTile = null;
          var tileLine = line
            .trim()
            .split(" ")
            .map(function(code, tileIndex) {
              if (code === "0" || !code || !code.length) {
                return null;
              }
              var id = code;
              if (code === "1") {
                code = Math.random() + "";
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
              Arrays.seq(0, 1).map(function(value) {
                var otherTile = lastLine[tileIndex + value + modifier];
                if (otherTile) {
                  otherTile.nextTo(tile);
                }
              });
            });
          }
          lastLine = tileLine;
          return tileLine;
        });
        return tiles;
      });
    }
    getTilePoints(position) {
      var xSize = tileSize;
      var ySize = (tileSize * 2) / Math.sqrt(3);
      var yStep = ySize / 4;
      var xStep = xSize / 2;
      var pixelPos = new Point([
        position[0] * xSize,
        position[1] * (yStep * 3)
      ]);
      if (position[1] % 2 === 1) {
        pixelPos[0] += xStep;
      }
      return [
        pixelPos.plus([xStep, 0]),
        pixelPos.plus([0, yStep]),
        pixelPos.plus([0, yStep * 3]),
        pixelPos.plus([xStep, yStep * 4]),
        pixelPos.plus([xStep * 2, yStep * 3]),
        pixelPos.plus([xStep * 2, yStep])
      ];
    }
    getSegments(points) {
      return points.map(function(point, index) {
        var nextIndex = (index + 1) % points.length;
        return [point, points[nextIndex]].sort(function(a, b) {
          return a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : a[1] < b[1] ? -1 : 1;
        });
      });
    }
    getAroundLine(segments) {
      segments = segments.concat([]).map(points => {
        return points.map(point => new Point(point));
      });
      var line = segments.splice(0, 1)[0].concat([]);
      while (segments.length) {
        var lastPoint = line[line.length - 1];
        var segmentIndex = segments.findIndex(function(segment) {
          return segment.find(function(point, index) {
            return point.distance(lastPoint) < distEpsilon;
          });
        });
        var segment = segments[segmentIndex];
        !segment &&
          console.error("could not find segment", lastPoint, line, segments);
        var nextPoint = segment.find(function(point) {
          return point.distance(lastPoint) > distEpsilon;
        });
        !nextPoint &&
          console.error("could not find next point", lastPoint, segment);
        line.push(nextPoint);
        segments.splice(segmentIndex, 1);
      }
      return line;
    }
    removeDuplicates(segments) {
      segments = segments.concat([]).map(points => {
        return points.map(point => new Point(point));
      });
      var result = [segments[0]];
      segments.splice(0, 1);
      segments.forEach(segment => {
        var isNew = result.every(otherSegment => {
          var dists = segment.map((point, index) => {
            return point.distance(otherSegment[index]);
          });
          return sum(dists) > distEpsilon;
        });
        if (isNew) {
          result.push(segment);
        } else {
          var found = result.findIndex(function(otherSegment) {
            var dists = segment.map(function(point, index) {
              return point.distance(otherSegment[index]);
            });
            return sum(dists) < distEpsilon;
          });
          if (found >= 0) {
            result.splice(found, 1);
          }
        }
      });
      return result;
    }
    getTerritories(name) {
      return this.getTiles(name).then(tiles => {
        var blocks = {};
        tiles.map(tile => {
          if (!blocks[tile.code]) {
            blocks[tile.code] = tile.getBlock();
          }
        });
        return Object.keys(blocks).map((key, index) => {
          var block = blocks[key];
          var segments = Arrays.flatMap(block, tile => {
            return this.getSegments(this.getTilePoints(tile.pos));
          });
          segments = this.removeDuplicates(segments);
          var points = this.getAroundLine(segments);
          var contents = points.map(point => {
            return point[0] + "," + point[1];
          });
          var pathValue = "M" + contents.join(",") + "Z";

          var territory = {
            type: block[0].id !== "1" ? "earth" : "sea",
            path: pathValue,
            index: index
          };
          if (territory.type === "earth") {
            territory.buildSlots = Math.min(4, block.length);
            territory.income = 4 - territory.buildSlots;
          }
          territory.box = this.getBox(points);
          territory.segments = segments;
          return territory;
        });
      });
    }
    getBox(points) {
      var xs = points.map(point => point[0]);
      var ys = points.map(point => point[1]);
      var minX = xs.reduce(minFct);
      var minY = ys.reduce(minFct);
      var maxX = xs.reduce(maxFct);
      var maxY = ys.reduce(maxFct);
      var box = {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY
      };
      return box;
    }
  }
  return new MapGenerator();
};
