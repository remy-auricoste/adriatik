var Game = Meta.declareClass("Game", {
  territories: ["Territory"],
  gods: ["God"],
  players: ["Player"],
  currentPlayer: "Player",
  init: function() {
    if (!this.currentPlayer) {
      this.currentPlayer = this.players[0];
    }
  }
});
