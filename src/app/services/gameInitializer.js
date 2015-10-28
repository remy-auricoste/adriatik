/** @ngInject */
function gameInitializer(gameSocket, accountService, qPlus, randomFactory) {
  'use strict';

  return {
    init: function(playerSize) {
      var self = this;
      var accounts = {};
      var defer = qPlus.defer();

      gameSocket.addRoomListener(function(messageObj) {
        if (messageObj.members.length >= playerSize) {
          gameSocket.send({account: accountService.getData()});
        }
      });
      gameSocket.addListener(function(messageObj) {
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
    createGame: function(accounts) {
      var players = Object.keys(accounts).map(function(id) {
        var account = accounts[id];
        account.id = id;
        var player = angular.extend(Player.new(account.name), new GraphicPlayer({account: account}));
        return player;
      });
      var game = new Game({
        players: players,
        gods: God.all,
        randomFactory: randomFactory,
        q: qPlus
      });
      return game.startTurn().then(function() {
        return game;
      });
    }
  }
}
angular.module("adriatik").service("gameInitializer", gameInitializer);


