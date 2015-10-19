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
    var self = this;
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
    if (!this.territories) {
      this.territories = [];
    }
    this.players.map(function(player) {
      player.randomFactory = self.randomFactory;
    });
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
      shuffled.map(function(god, index) {
        god.index = index;
      })
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
        return self.nextPhase();
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
        return self.nextPhase();
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
    if (god === God.Apollon) {
      player.placeBid(god, 0);
      return this.endPlayerTurn();
    }
    var removedPlayer = this.getPlayer(god);
    player.placeBid(god, amount);
    if (removedPlayer) {
      this.currentPlayer = removedPlayer;
      return removedPlayer;
    } else {
      return this.endPlayerTurn();
    }
  },
  nextPhase: function() {
    var self = this;
    if (self.phase === Phases.bidding) {
      self.phase = Phases.actions;
      var apollonPlayers = God.Apollon.playerNames.map(function(name) {
        return Meta.find(self.players, function(player) {
          return player.name === name;
        });
      });
      self.players = self.currentGods.filter(function(god) {
        return god.bid && god !== God.Apollon;
      }).map(function(god) {
        return self.getPlayer(god);
      });
      self.players = self.players.concat(apollonPlayers);
      self.players.map(function(player) {
        player.payBid();
      });
      self.currentPlayer = self.players[0];
    } else if (self.phase === Phases.actions) {
      self.currentPlayer = self.players[0];
      self.phase = Phases.bidding;
      self.players.map(function(player) {
        player.bid.god.bid = null;
        player.bid = null;
        player.god = null;
      });
      God.Apollon.playerNames = [];
      return self.startTurn();
    }
  },
  receiveCommand: function(command) {
    if (!command.player || command.player !== this.currentPlayer) {
      throw new Error("received command not from currentPlayer"+JSON.stringify(command));
    }
    var commandNames = CommandType.all.map(function(commandType) {
      return commandType.name;
    });
    if (commandNames.indexOf(command.type.name) === -1) {
      throw new Error("unknown command type "+command.type.name);
    }
    if (command.type.argCount !== command.args.length) {
      throw new Error("got "+command.args.length+" args but needed "+command.type.argCount+" args");
    }
    if (command.type === CommandType.Bid) {
      return this.placeBid(this.currentPlayer, command.args[0], command.args[1]);
    } else if (command.type === CommandType.InitUnit) {
      return this.initUnit(this.currentPlayer, command.args[0]);
    } else {
      return this.currentPlayer[command.type.methodName](command.args[0], command.args[1], command.args[2]);
    }
  },
  initUnit: function(player, territory) {
    if (this.turn !== 1) {
      throw new Error("dev error: you cannot use this method if it is not turn 1");
    }
    try {
      if (territory.owner && territory.owner !== player) {
        throw new Error("vous devez contrôler le territoire ou le territoire doit être neutre");
      }
      var playerTerritories = this.territories.filter(function(territory) {
        return territory.owner === player;
      });
      if (!territory.owner) {
        var sameTypeTerritories = playerTerritories.filter(function(territoryIte) {
          return territory.type === territoryIte.type;
        });
        if (sameTypeTerritories.length === 2) {
          throw new Error("vous devez prendre 2 territoires terrestres et 2 territoires maritimes contigus");
        }
        var isAdjacent = !Meta.forall(playerTerritories, function(territoryIte) {
          return territoryIte.neighbours.indexOf(territory.id) === -1;
        });
        if (playerTerritories.length && !isAdjacent) {
          throw new Error("il n'est pas adjacent aux territoires déjà contrôllés");
        }
      }
      var self = player;
      var unitType = territory.type === "earth" ? UnitType.Troup : UnitType.Ship;
      var currentValue = player.initCount[unitType.name];
      if (!currentValue) {
        currentValue = 0;
      }
      var allowedValue = 2 + (player.god.unitType && player.god.unitType === unitType ? 1 : 0);
      if (currentValue === allowedValue) {
        throw new Error("vous ne pouvez pas ajouter d'autres unités de type "+unitType.name);
      }
      if (currentValue === allowedValue - 1 && territory.owner === player) {
        throw new Error("vous devez prendre 2 territoires terrestres et 2 territoires maritimes contigus");
      }
      currentValue++;
      player.initCount[unitType.name] = currentValue;
      var unit = new Unit({
        type: unitType,
        owner: self
      });
      territory.owner = player;
      territory.placeUnit(unit);
    } catch(err) {
      throw new Error("Impossible de placer une unité sur ce territoire : "+err.message);
    }
  }
});
