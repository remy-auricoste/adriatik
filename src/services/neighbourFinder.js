var Meta = require("../alias/Meta");

module.exports = {
  getCorners: function (box) {
    return [
      {x: box.x, y: box.y},
      {x: box.x + box.width, y: box.y},
      {x: box.x + box.width, y: box.y + box.height},
      {x: box.x, y: box.y + box.height}
    ]
  },
  isInside: function (point, box) {
    return box.x <= point.x && point.x <= (box.x + box.width) && box.y <= point.y && point.y <= (box.y + box.height);
  },
  findNeighboursSimple: function (territory, territories) {
    var self = this;
    var corners = self.getCorners(territory.box);
    return territories.filter(function (territoryIt) {
      var otherBox = territoryIt.box;
      return corners.some(function (corner) {
        return self.isInside(corner, otherBox);
      });
    })
  },
  findRealNeighbours: function (territory, territories) {
    var segments = Raphael.parsePathString(territory.path);
    var neighboursFound = this.findNeighboursSimple(territory, territories).filter(function (neighbour) {
      var otherSegments = Raphael.parsePathString(neighbour.path);
      return Meta.find(segments, function (segment) {
        return Meta.find(otherSegments, function (otherSegment) {
          var x = segment[1];
          var y = segment[2];
          var otherx = otherSegment[1];
          var othery = otherSegment[2];
          var distancex = Math.abs(x - otherx);
          var distancey = Math.abs(y - othery);
          var threshold = 2;
          return distancex <= threshold && distancey <= threshold
        })
      });
    });
    return neighboursFound;
  }
}


