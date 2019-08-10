var Meta = require("../alias/Meta");

module.exports = {
  getCorners: function (box) {
    return [
      [box.x, box.y],
      [box.x + box.width, box.y],
      [box.x + box.width, box.y + box.height],
      [box.x, box.y + box.height]
    ]
  },
  isInside: function (point, box) {
    return box.x <= point[0] && point[0] <= (box.x + box.width) && box.y <= point[1] && point[1] <= (box.y + box.height);
  },
  distance: function(point1, point2) {
    var diffX = Math.abs(point1[0] - point2[0]);
    var diffY = Math.abs(point1[1] - point2[1]);
    return Math.sqrt(diffX + diffY);
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
    var segments = territory.segments;
    var neighboursFound = this.findNeighboursSimple(territory, territories).filter(neighbour => {
      var otherSegments = neighbour.segments;
      return segments.find(segment => {
        return otherSegments.find(otherSegment => {
          var x = segment[0];
          var y = segment[1];
          var otherx = otherSegment[0];
          var othery = otherSegment[1];
          var distancex = this.distance(x, otherx);
          var distancey = this.distance(y, othery);
          var threshold = 2;
          return distancex <= threshold && distancey <= threshold
        })
      });
    });
    return neighboursFound;
  }
}


