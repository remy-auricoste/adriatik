const tileSize = 90;
const xSize = tileSize;
const ySize = (tileSize * 2) / Math.sqrt(3);
const distEpsilon = 0.5;

const minFct = (a, b) => {
  return Math.min(a, b);
};
const maxFct = (a, b) => {
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
    getTiles(template) {
      const lines = template.split("\n").filter(line => !!line);
      let id = 0;

      const link = (tileA, tileB) => {
        tileA.neighbours.push(tileB.id);
        tileB.neighbours.push(tileA.id);
      };

      const tiles = Arrays.flatMap(lines, (line, lineIndex) => {
        const values = line.split(" ").filter(value => value !== "");
        const shouldAdd = lineIndex % 2 === 1;
        const addedX = shouldAdd ? 0.5 : 0;

        return values
          .map((value, index) => {
            return {
              code: parseInt(value),
              id: id++,
              pos: { x: index + addedX, y: lineIndex },
              neighbours: []
            };
          })
          .filter(tile => !!tile.code);
      });
      tiles.forEach((tile, index) => {
        tiles
          .slice(index + 1)
          .filter(tile2 => {
            return (
              Math.abs(tile.pos.x - tile2.pos.x) <= 1 &&
              Math.abs(tile.pos.y - tile2.pos.y) <= 1
            );
          })
          .forEach(tile2 => link(tile, tile2));
      });
      return tiles;
    }
    getBlocks(template) {
      const tiles = this.getTiles(template);
      const blocks = Arrays.flatMap(
        Object.values(Arrays.groupBy(tiles, tile => tile.code)),
        group => {
          const { code } = group[0];
          return code === 1 ? group.map(tile => [tile]) : [group];
        }
      )
        .map(group => {
          const { code } = group[0];
          const tiles = group.map(tile => tile.pos);
          const tileIds = group.map(tile => tile.id);
          const tileNeighbours = Arrays.toSet(
            Arrays.flatMap(group, tile => tile.neighbours)
          ).filter(id => tileIds.indexOf(id) === -1);
          return {
            code,
            tiles,
            tileNeighbours,
            tileIds
          };
        })
        .sort((a, b) => (a.code < b.code ? -1 : 1))
        .map((block, index) => Object.assign(block, { id: index }));

      return blocks.map(block => {
        const { code, tiles, tileNeighbours, id } = block;
        const neighbourBlockIds = Arrays.toSet(
          tileNeighbours.map(
            tileId =>
              blocks.find(block2 => block2.tileIds.indexOf(tileId) !== -1).id
          )
        );
        return {
          id,
          code,
          tiles,
          neighbours: neighbourBlockIds.sort()
        };
      });
    }

    getTilesOld(name) {
      return new Request().get("/maps/" + name + ".txt").then(res => {
        var content = res.body;

        var lastLine = null;
        var lines = content.split("\n");
        var tiles = Arrays.flatMap(lines, (line, lineIndex) => {
          var lastTile = null;
          var tileLine = line
            .trim()
            .split(" ")
            .map((code, tileIndex) => {
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
          tileLine = tileLine.filter(tile => !!tile);
          if (lastLine) {
            var modifier = lineIndex % 2 === 0 ? -1 : 0;
            tileLine.map((tile, tileIndex) => {
              Arrays.seq(0, 1).map(value => {
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
      const yStep = ySize / 4;
      const xStep = xSize / 2;
      const pixelPos = new Point([
        position[0] * xSize,
        position[1] * (yStep * 3)
      ]);
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
      return points.map((point, index) => {
        const nextIndex = (index + 1) % points.length;
        return [point, points[nextIndex]].sort((a, b) => {
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
        var segmentIndex = segments.findIndex(segment => {
          return segment.find(point => {
            return point.distance(lastPoint) < distEpsilon;
          });
        });
        var segment = segments[segmentIndex];
        if (segment) {
          var nextPoint = segment.find(point => {
            return point.distance(lastPoint) > distEpsilon;
          });
          if (nextPoint) {
            line.push(nextPoint);
          } else {
            console.error("could not find next point", lastPoint, segment);
          }
        } else {
          console.error("could not find segment", lastPoint, line, segments);
        }
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
        const isNew = result.every(otherSegment => {
          const dists = segment.map((point, index) => {
            return point.distance(otherSegment[index]);
          });
          return sum(dists) > distEpsilon;
        });
        if (isNew) {
          result.push(segment);
        } else {
          const found = result.findIndex(otherSegment => {
            const dists = segment.map((point, index) => {
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
    getTerritories(template) {
      const blocks = this.getBlocks(template);
      return blocks.map(block => {
        const { tiles, code, id, neighbours } = block;
        let segments = Arrays.flatMap(tiles, tilePos => {
          const { x, y } = tilePos;
          const tilePoints = this.getTilePoints([x, y]);
          return this.getSegments(tilePoints);
        });
        segments = this.removeDuplicates(segments);
        const points = this.getAroundLine(segments);
        const contents = points.map(point => {
          return point[0] + "," + point[1];
        });
        const pathValue = "M" + contents.join(",") + "Z";
        const territory = {
          type: code === 1 ? "sea" : "earth",
          path: pathValue,
          id,
          neighbours,
          tiles: tiles.map(({ x, y }) => {
            return {
              x: x * xSize + xSize * 0.5,
              y: y * ySize * 0.75 + ySize * 0.5
            };
          })
        };
        if (territory.type === "earth") {
          territory.buildSlots = Math.min(4, tiles.length);
          territory.baseIncome = Math.max(0, 3 - territory.buildSlots);
        }
        territory.box = this.getBox(points);
        territory.segments = segments;
        return territory;
      });
    }
    getBox(points) {
      const xs = points.map(point => point[0]);
      const ys = points.map(point => point[1]);
      const minX = xs.reduce(minFct);
      const minY = ys.reduce(minFct);
      const maxX = xs.reduce(maxFct);
      const maxY = ys.reduce(maxFct);
      const box = {
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
