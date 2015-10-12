var Game = Meta.declareClass("Game", {
  territories: ["Territory"],
  gods: ["God"],
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
    return self.randomFactory.shuffle(self.gods);
  }
});
