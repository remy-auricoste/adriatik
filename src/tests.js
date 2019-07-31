require("./model/natif/Errors");
require("./model/natif/Strings");

const RandomReaderAsync = require("./services/RandomReaderAsync");
const Random = require("rauricoste-random").zero;
const randomReaderAsync = RandomReaderAsync(Random);

const Injector = require("./Injector");
const injector = new Injector();
Injector.instance = injector;
injector.add("randomReaderAsync", randomReaderAsync);
injector.add("Arrays", require("rauricoste-arrays"), true);
injector.add("Commandify", require("rauricoste-commandify"), true);
injector.add("Logger", require("rauricoste-logger"), true);
injector.add("Request", require("rauricoste-request"), true);

const newModelIndex = require("./model/newModel/index");
injector.addAll(newModelIndex);
const battleIndex = require("./model/newModel/battle/index");
injector.addAll(battleIndex);

const Tile = require("./model/tools/Tile");
const mapGenerator = require("./services/mapGenerator");
injector.addAll({
  Tile,
  mapGenerator
});

window = {};

expect = require("rauricoste-tests");
