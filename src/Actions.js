var Commandify = require("rauricoste-commandify");
var injector = require("./core/MyInjector");

var Actions = function(store) {
    var commands = store.getCommandEmitter();
    var initGame = store.getState().game;
    return {
      selectMode: function(mode) {
        commands.set("mode", mode);
      },
      Game: Commandify(initGame, {
        wrapper: function(command) {
          commands.set("game", Commandify.applyCommand(store.getState().game, command));
          return command;
        }
      }),
      resetSelection: function() {
        commands.set("selection", {
          units: []
        })
      }
    }
}

module.exports = Actions;
