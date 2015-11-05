/** @ngInject */
function gameInitializer(gameSocket, accountService, qPlus, randomFactory, gameStorage, $http, neighbourFinder) {
  'use strict';

  return {
    init: function (playerSize) {
      var self = this;
      var path = window.location.pathname;
      if (path.startsWith("/dev/")) {
        return qPlus.fcall(function () {
          return self.createGame(self.devAccounts(playerSize));
        });
      }

      var self = this;
      var accounts = {};
      var defer = qPlus.defer();

      gameSocket.addRoomListener(function (messageObj) {
        if (messageObj.members.length >= playerSize) {
          gameSocket.send({account: accountService.getData()});
        }
      });
      gameSocket.addListener(function (messageObj) {
        var account = messageObj.message.account;
        if (account) {
          accounts[messageObj.source] = account;
          if (Object.keys(accounts).length === playerSize) {
            defer.resolve(self.createGame(accounts));
          }
        }
      });
      return defer.promise;
    },
    createGame: function (accounts) {
      var loaded = gameStorage.load();
      console.log("loaded", loaded);
      if (loaded) {
        loaded.randomFactory = randomFactory;
        loaded.q = qPlus;
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
        randomFactory: randomFactory,
        q: qPlus
      });

      return $http.get("/app/components/map/area.json").then(function (res) {
        var paths = res.data;
        var territories = paths.map(function (path) {
          var pathValue = path.d;
          var territory = new Territory({
            type: "earth",
            buildSlots: 2,
            path: pathValue
          });
          territory.box = Raphael.pathBBox(pathValue);
          return territory;
        });
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
        {name: "Rémy", email: "remy.auricoste@gmail.com"}
      ];
      accounts = accounts.slice(0, playerSize);
      var result = {};
      accounts.map(function (account) {
        result[account.name] = account;
      });
      return result;
    }
  }
}
angular.module("adriatik").service("gameInitializer", gameInitializer);


