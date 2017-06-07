var Commandify = require("rauricoste-commandify");
var injector = require("./core/MyInjector");

var HistoryService = require("./services/HistoryService");

var ActionsBuilder = function(store) {
    var commands = store.getCommandEmitter();
    var initGame = store.getState().game;
    var Actions = {
      selectMode: function(mode) {
        commands.set("mode", mode);
      },
      Game: Commandify(initGame, {
        wrapper: function(command) {
          var commandResult = Commandify.applyCommand(store.getState().game, command);
          var thenFct = function(game) {
            commands.set("game", game);
//            HistoryService.saveState(game);
          }
          commandResult.then ? commandResult.then(thenFct) : thenFct(commandResult);
          return command;
        }
      }),
      resetSelection: function() {
        commands.set("selection", {
          units: []
        })
      },
      selectCommand: function(commandType) {
        commands.set("command", {
          type: commandType,
          args: []
        });
      },
      fillCommand: function(value) {
        var state = store.getState();
        console.log("fillCommand", value, state.command);
        var stateCommand = state.command;
        if (stateCommand.args.length === stateCommand.type.argCount - 1) {
          console.log("applying", stateCommand);
          this.Game[stateCommand.type.methodName].apply(state.game, stateCommand.args.concat([value]));
          this.selectCommand(null);
        } else {
          commands.push("command.args", value);
        }
      }
    };
    return Actions;
}

module.exports = ActionsBuilder;
