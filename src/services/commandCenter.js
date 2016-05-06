var commandSocket = require("./commandSocket");
var gameStorage = require("./gameStorage");
var randomFactory = require("./randomFactory");
var Command = require("../model/data/Command");
var config = require("./config");

commandSocket.addListener(function(messageObj) {
  var source = messageObj.source;
  if (source === commandSocket.getId()) {
    // ignore my commands
    return;
  }
  var command = Command.fromObject(messageObj.message);
  console.log("commandSocket received", command, "source", source);
  var playerSocketId = command.player.account.id;
  if (!config.isDev() && playerSocketId !== source) {
    throw new Error("received a command not from the actual player. source="+source+". player id="+playerSocketId);
  }
  CommandCenter.execute(command);
});

var CommandCenter = {
  setGame: function(game) {
    this.game = game;
  },
  linkScope: function(scope) {
    this.scope = scope;
  },
  execute: function(command) {
    var self = this;
    var game = this.game;
    if (!command.id) {
      var id = Math.random() + "";
      command.id = id;
    }
    if (!command.player) {
      command.player = this.game.currentPlayer;
    }
    randomFactory.setGlobalId(command.id);
    var result = game.receiveCommand(command);
    var thenFct = function(result) {
      gameStorage.save(game);
      setTimeout(function() {
        self.scope.$apply();
      }, 0);
    }
    if (result && typeof result.then === "function") {
      result.then(thenFct).catch(function(err) {
        console.error("error");
        console.error(err);
      });
    } else {
      thenFct(result);
    }
  },
  send: function(command) {
    if (!config.isDev() && commandSocket.getId() !== command.player.account.id) {
      throw new Error("Ce n'est pas à votre tour de jouer");
    }
    this.execute(command);
    console.log("sending command", command);
    commandSocket.send(JSON.parse(JSON.stringify(command)));
  }
};

module.exports = CommandCenter;
