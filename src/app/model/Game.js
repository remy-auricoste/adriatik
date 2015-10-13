var Game = Meta.declareClass("Game", {
  territories: ["Territory"],
  gods: ["God"],
  currentGods: ["God"],
  players: ["Player"],
  bidPlayers: ["Player"],
  currentPlayer: "Player",
  randomFactory: {},
  q: "fct",
  turn: 1,
  init: function() {
    if (!this.currentPlayer) {
      this.currentPlayer = this.players[0];
    }
    if (!this.gods) {
      this.gods = [];
    }
    if (!this.turn) {
      this.turn = 0;
    }
  },
  startTurn: function() {
    var self = this;
    self.turn++;
    var normalGods = self.gods.filter(function(god) {
      return god !== God.Apollon;
    });
    var godPromise = self.randomFactory.shuffle(normalGods).then(function(shuffled) {
      shuffled = shuffled.slice(0, self.players.length - 1);
      shuffled.push(God.Apollon);
      self.currentGods = shuffled;
    });
    var playersPromise = self.q.empty();
    if (self.turn === 1) {
      self.bidPlayers = self.players.concat([]);
      playersPromise = self.randomFactory.shuffle(self.bidPlayers);
    }
    return self.q.all([godPromise, playersPromise]);
  },
  endPlayerTurn: function() {
    var self = this;
    var index = Meta.findIndex(self.players, function(player) {
      return player === self.currentPlayer;
    });
    if (index < 0) {
      throw new Error("could not find current player");
    }
    index++;
    if (index >= self.players.length) {
      // TODO change phase
    } else {
      self.currentPlayer = self.players[index];
    }
  }
});
