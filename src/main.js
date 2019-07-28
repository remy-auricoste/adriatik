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
  ReactDOM,
  injector
});

Injector.instance = injector;

const Store = libs["rauricoste-store-sync"];
const store = new Store();
const storeCommands = store.getCommandEmitter();
injector.addAll({
  randomReaderAsync,
  Arrays: libs["rauricoste-arrays"],
  Commandify: libs["rauricoste-commandify"],
  Logger: libs["rauricoste-logger"],
  Request: libs["rauricoste-request"],
  store,
  storeCommands
});

const components = require("./components/index");
injector.addAll(components);
const newModelIndex = require("./model/newModel/index");
injector.addAll(newModelIndex);
const battleIndex = require("./model/newModel/battle/index");
injector.addAll(battleIndex);

injector.addAll({
  Tile: require("./model/tools/Tile"),
  mapGenerator: require("./services/mapGenerator")
});

const {
  Game,
  GameSettings,
  Player,
  XRoot,
  mapGenerator,
  Territory
} = injector.resolveAll();
const settings = new GameSettings();
const players = [new Player(), new Player()];

mapGenerator.getTerritories("standard").then(territories => {
  territories = territories.map(territory => new Territory(territory));

  const game = new Game({
    settings,
    gods: settings.gods,
    players,
    territories
  });
  console.log(game);

  const appElement = document.getElementById("app");
  const render = () => {
    const { game } = store.getState();
    ReactDOM.render(<XRoot game={game} />, appElement);
  };

  storeCommands.set("game", game);

  store.subscribe(render);
  render();
});
