var gameSocket = require("./gameSocket");
var accountService = require("./accountService");
var qPlus = require("./qPlus");
var randomFactory = require("./randomFactory");
var gameStorage = require("./gameStorage");
var neighbourFinder = require("./neighbourFinder");
var config = require("./config");
var mapGenerator = require("./mapGenerator");

var StateSync = require("../model/tools/StateSync");

var Player = require("../model/data/Player");
var Game = require("../model/data/Game");
var God = require("../model/data/God");

var initSocket = gameSocket.subSocket("init");

var gameInitializer = {
  init: function (playerSize) {
    var self = this;
    if (config.isDev()) {
      randomFactory.setNetworkSize(1);
      return qPlus.value(self.createGame(self.devAccounts(playerSize)));
    }
    randomFactory.setNetworkSize(playerSize);

    var self = this;
    var accounts = {};
    var defer = qPlus.defer();
    var initSync = new StateSync(initSocket);
    var id = "init";
    gameSocket.addRoomListener(function (messageObj) {
      console.log("received", messageObj);
      if (messageObj.members.length === playerSize) {
        console.log("all players connected => sending account data", accountService.getData());
        initSync.send(id, playerSize, accountService.getData());
      }
    });
    initSync.syncListener(function(id, size, value) {
    }, function(stored) {
      var accounts = stored.values;
      console.log("accounts", accounts);
      defer.resolve(self.createGame(accounts));
    })
    return defer.promise;
  },
  createGame: function (accounts) {
    console.log("creating game", accounts);
    var loaded = gameStorage.load();
    console.log("loaded", loaded);
    if (loaded) {
      loaded.randomFactory = randomFactory;
      loaded.q = qPlus;
      Object.keys(accounts).map(function(id) {
        var account = accounts[id];
        account.id = id;
        // use account.email as the key to retrieve account. Is it the right way to do it ?
        var player = Meta.find(loaded.players, function(player) {
          return player.account.email === account.email;
        });
        player.account = account;
      });
      return new Game(loaded);
    }

    var players = Object.keys(accounts).map(function (id) {
      var account = accounts[id];
      account.id = id;
      var player = Player.new(account.name);
      player.account = account;
      return player;
    });
    var game = new Game({
      players: players,
      gods: God.allArray(),
      warMode: false
    });

    return mapGenerator.getTerritories("standard").then(function(territories) {
      territories.map(function (territory) {
        var neighbours = neighbourFinder.findRealNeighbours(territory, territories);
        neighbours.map(function (neighbour) {
          if (neighbour === territory) {
            return;
          }
          territory.nextTo(neighbour);
        })
      });
      return territories;
    }).then(function (territories) {
      game.territories = territories;
      return game.startTurn();
    }).then(function () {
      return game;
    });
  },
  devAccounts: function (playerSize) {
    var accounts = [
      {name: "Alain", email: "adoanhuu@gmail.com"},
      {name: "Alan", email: "alan.leruyet@free.fr"},
      {name: "Charles", email: "chales.lescot@gmail.com"},
      {name: "Rémy", email: "remy.auricoste@gmail.com"},
      {name: "Baptiste", email: "bapt@gmail.com"}
    ];
    accounts = accounts.slice(0, playerSize);
    var result = {};
    accounts.map(function (account) {
      result[account.name] = account;
    });
    return result;
  }
}

module.exports = gameInitializer;
