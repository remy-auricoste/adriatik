var Game = Meta.declareClass("Game", {
  territories: ["Territory"],
  gods: ["God"],
  currentGods: ["God"],
  players: ["Player"],
  currentPlayer: "Player",
  randomFactory: {},
  init: function() {
    if (!this.currentPlayer) {
      this.currentPlayer = this.players[0];
    }
    if (!this.gods) {
      this.gods = [];
    }
  },
  startTurn: function() {
    var self = this;
    var normalGods = self.gods.filter(function(god) {
      return god !== God.Apollon;
    });
    return self.randomFactory.shuffle(normalGods).then(function(shuffled) {
      shuffled = shuffled.slice(0, self.players.length - 1);
      shuffled.push(God.Apollon);
      self.currentGods = shuffled;
    });
  }
});
