const libs = require("./libs");

const isTest = typeof window === "undefined";

const RandomReaderAsync = require("./services/RandomReaderAsync");
const libRandom = libs["rauricoste-random"];
const Random = isTest ? libRandom.zero : libRandom.simple;
const randomReaderAsync = RandomReaderAsync(Random);

const Injector = require("./Injector");
const injector = new Injector();

const libRenames = {
  "rauricoste-arrays": "Arrays",
  "rauricoste-commandify": "Commandify",
  "rauricoste-logger": "Logger",
  "rauricoste-request": "Request"
};

Object.keys(libRenames).forEach(libName => {
  const libNewName = libRenames[libName];
  const lib = libs[libName];
  injector.add(libNewName, lib, true);
});

const Store = libs["rauricoste-store-sync"];
const store = new Store();
const storeCommands = store.getCommandEmitter();
injector.addAll({
  randomReaderAsync,
  store,
  storeCommands
});

const newModelIndex = require("./model/newModel/index");
injector.addAll(newModelIndex);
const battleIndex = require("./model/newModel/battle/index");
injector.addAll(battleIndex);
const roomIndex = require("./model/room/index");
injector.addAll(roomIndex);
const actionsIndex = require("./actions/index");
injector.addAll(actionsIndex);

injector.addAll({
  Tile: require("./model/tools/Tile"),
  mapGenerator: require("./services/mapGenerator"),
  commandHandler: require("./commandHandler")
});

module.exports = injector;
