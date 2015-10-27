/** @ngInject */
function gameInitializer(gameSocket, accountService, qPlus, randomFactory) {
  'use strict';

  return {
    init: function() {
      var self = this;
      // TODO read from url
      var playerSize = 4;
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
        account.id = id;
        return Player.new(account);
      });
      return new Game({
        players: players,
        gods: God.all,
        randomFactory: randomFactory,
        q: qPlus
      }).startTurn();
    }
  }
}
angular.module("adriatik").service("gameInitializer", gameInitializer);


