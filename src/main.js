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
const roomIndex = require("./model/room/index");
injector.addAll(roomIndex);

const commandHandler = ({ command }) => {
  let { game } = store.getState();
  game = command.apply(game);
  if (game.constructor !== Promise) {
    game = Promise.resolve(game);
  }
  game.then(game => {
    storeCommands.set("game", game);
    localStorage.game = JSON.stringify(game);
  });
};

injector.addAll({
  Tile: require("./model/tools/Tile"),
  mapGenerator: require("./services/mapGenerator"),
  commandHandler
});

const {
  Game,
  GameSettings,
  Player,
  XRoot,
  mapGenerator,
  Territory,
  Account,
  Room
} = injector.resolveAll();

const template = `
0 0 1 9 1 2 1 1 0 0 0 0
 0 0 9 9 1 2 1 1 0 0 0 0
0 0 1 1 9 1 1 3 3 0 0 0
 0 0 8 1 1 4 1 1 0 0 0
0 0 8 8 1 4 1 5 5 0 0 0
 0 0 1 1 1 1 1 5 0 0 0
0 0 1 1 7 1 6 1 0 0 0 0
 0 0 1 1 1 1 1 0 0 0 0
`;
let territories = mapGenerator.getTerritories(template);
territories = territories.map(territory => new Territory(territory));

const { game: gameJson } = localStorage;
const storedGame = gameJson && new Game(JSON.parse(gameJson)); // TODO

const players = [new Player(), new Player()];
const defaultPlayerColors = ["red", "blue", "green", "yellow"];
const accounts = players.map(
  (_, index) =>
    new Account({
      id: Math.random().toString(),
      name: "name" + Math.random(),
      color: defaultPlayerColors[index]
    })
);
const settings = new GameSettings();
const game = new Game({
  settings,
  gods: settings.gods,
  players,
  territories
});

const appElement = document.getElementById("app");
const render = () => {
  const { game } = store.getState();
  console.log(game);
  ReactDOM.render(<XRoot game={game} />, appElement);
};

const finalGame = storedGame || game;
storeCommands.set("game", finalGame);
const room = new Room({ players: finalGame.players, accounts });
storeCommands.set("room", room);

store.subscribe(render);
render();
