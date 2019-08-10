const isTest = typeof window === "undefined";
const libs = require("./libs");

const React = libs["react"];
const ReactDOM = libs["react-dom"];

!isTest &&
  Object.assign(window, {
    React,
    ReactDOM
  });

const Injector = require("./Injector");
const injector = new Injector();

const libRandom = libs["rauricoste-random"];
const Random = isTest ? libRandom.zero : libRandom.simple;
injector.add("randomReader", Random);

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
  store,
  storeCommands
});

const index = require("./index");
injector.addAll(index);

module.exports = injector;
