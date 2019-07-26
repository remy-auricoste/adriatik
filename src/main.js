const libs = window.libs;
const React = libs["react"];
const ReactDOM = libs["react-dom"];

require("./model/natif/Errors");
require("./model/natif/Strings");

const RandomReaderAsync = require("./services/RandomReaderAsync");
const Random = libs["rauricoste-random"].simple;
const randomReaderAsync = RandomReaderAsync(Random);

const Injector = require("./Injector");
const injector = new Injector();

Object.assign(window, {
  React,
  injector
});

Injector.instance = injector;
injector.add("randomReaderAsync", randomReaderAsync);
injector.add("Arrays", libs["rauricoste-arrays"]);
injector.add("Commandify", libs["rauricoste-commandify"]);
injector.add("Logger", libs["rauricoste-logger"]);
injector.add("Request", libs["rauricoste-request"]);

const components = require("./components/index");
injector.addAll(components);
const newModelIndex = require("./model/newModel/index");
injector.addAll(newModelIndex);
const battleIndex = require("./model/newModel/battle/index");
injector.addAll(battleIndex);

const { Game, GameSettings, Player, XRoot } = injector.resolveAll();
const settings = new GameSettings();
const players = [new Player(), new Player()];
const game = new Game({ settings, gods: settings.gods, players });

console.log(game);

// var Store = require("rauricoste-store");
// var Actions = require("./Actions");
// GameCreator.create(4, "standard").then(game => {
//   var initState = {
//     game: HistoryService.getState() || game
//   };
//   logger.info("initState", initState);
//   window.store = new Store(initState);
//   window.Actions = Actions(window.store);

// });

ReactDOM.render(<XRoot game={game} />, document.getElementById("app"));
