const libs = window.libs;
const React = libs["react"];
const ReactDOM = libs["react-dom"];

require("./model/natif/Errors");
require("./model/natif/Strings");

const injector = require("./injects");

Object.assign(window, {
  React,
  ReactDOM,
  injector
});

const components = require("./components/index");
injector.addAll(components);

const {
  Game,
  GameSettings,
  Player,
  XRoot,
  mapGenerator,
  Territory,
  Account,
  Room,
  storeCommands,
  store
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
  const state = store.getState();
  const { game } = state;
  console.log("state", state);
  console.log("selection", state.selection);
  ReactDOM.render(<XRoot game={game} />, appElement);
};

const finalGame = storedGame || game;
storeCommands.set("game", finalGame);
const room = new Room({ players: finalGame.players, accounts });
storeCommands.set("room", room);

store.subscribe(render);
render();
