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
  phase: "",
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
    if (!this.phase) {
      this.phase = Phases.bidding;
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
    if (self.phase === Phases.bidding) {
      var freePlayers = self.players.filter(function(player) {
        return !player.bid;
      });
      if (freePlayers.length) {
        self.currentPlayer = freePlayers[0];
      } else {
        self.phase = Phases.actions;
        self.players = self.currentGods.filter(function(god) {
          return god.bid;
        }).map(function(god) {
          return self.getPlayer(god);
        });
        self.players.map(function(player) {
          player.payBid();
        });
        self.currentPlayer = self.players[0];
      }
    } else if (self.phase === Phases.actions) {
      var index = Meta.findIndex(self.players, function(player) {
        return player === self.currentPlayer;
      });
      if (index < 0) {
        throw new Error("could not find current player");
      }
      index++;
      if (index >= self.players.length) {
        self.currentPlayer = self.players[0];
        self.phase = Phases.bidding;
        self.players.map(function(player) {
          player.bid.god.bid = null;
          player.bid = null;
          player.god = null;
        });
        return self.startTurn();
      } else {
        self.currentPlayer = self.players[index];
      }
    }
  },
  getPlayer: function(god) {
    var biddingPlayers = this.players.filter(function(player) {
      return player.bid && player.bid.god === god;
    });
    biddingPlayers.sort(function(a,b) {
      return b.bid.gold - a.bid.gold;
    });
    return biddingPlayers[0];
  },
  placeBid: function(player, god, amount) {
    var removedPlayer = this.getPlayer(god);
    player.placeBid(god, amount);
    if (removedPlayer) {
      this.currentPlayer = removedPlayer;
      return removedPlayer;
    } else {
      return this.endPlayerTurn();
    }
  }
});
