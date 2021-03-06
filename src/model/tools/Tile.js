module.exports = function(Arrays) {
  return class Tile {
    constructor(id, code, pos, neighbours = []) {
      this.code = code;
      this.id = id;
      this.neighbours = neighbours;
      this.pos = pos;
    }
    nextTo(tile) {
      tile.neighbours.push(this);
      this.neighbours.push(tile);
    }
    getNeighbours(code, visited) {
      return this.neighbours.filter(tile => {
        return visited.indexOf(tile) === -1 && tile.code === code;
      });
    }
    getBlock() {
      const { code } = this;
      if (this.block) {
        return this.block;
      }
      let block = [];
      let added = [this];
      while (added.length) {
        block = block.concat(added);
        let visited = block.concat([]);
        added = Arrays.flatMap(added, tile => {
          const neighbours = tile.getNeighbours(code, visited);
          visited = visited.concat(neighbours);
          return neighbours;
        });
      }
      this.block = block;
      return block;
    }
  };
};
