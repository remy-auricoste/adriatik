require("./model/natif/Errors");
require("./model/natif/Strings");

const RandomReaderAsync = require("./services/RandomReaderAsync");
const Random = require("rauricoste-random").zero;
const randomReaderAsync = RandomReaderAsync(Random);

const Injector = require("./Injector");
const injector = new Injector();
Injector.instance = injector;
injector.add("randomReaderAsync", randomReaderAsync);

const newModelIndex = require("./model/newModel/index");
injector.addAll(newModelIndex);
const battleIndex = require("./model/newModel/battle/index");
injector.addAll(battleIndex);

expect = require("rauricoste-tests");
