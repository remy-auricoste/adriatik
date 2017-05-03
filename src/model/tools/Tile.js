var Arrays = require("rauricoste-arrays");

var Tile = function(id, code, pos) {
  this.code = code;
  this.id = id;
  this.neighbours = [];
  this.pos = pos;
}
Tile.prototype.nextTo = function(tile) {
  tile.neighbours.push(this);
  this.neighbours.push(tile);
}
Tile.prototype.getNeighbours = function(code, visited) {
  return this.neighbours.filter(function(tile) {
    return visited.indexOf(tile) === -1 && tile.code === code;
  });
}
Tile.prototype.getBlock = function() {
  if (this.block) {
    return this.block;
  }
  var self = this;
  var block = [];
  var added = [this];
  while (added.length) {
    block = block.concat(added);
    var visited = block.concat([]);
    var added = Arrays.flatMap(added, function(tile) {
      var neighbours = tile.getNeighbours(self.code, visited);
      visited = visited.concat(neighbours);
      return neighbours;
    });
  }
  this.block = block;
  return block;
}

module.exports = Tile;
