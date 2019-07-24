require("./test/window");

var env = require("./test/env");
env.mode = "test";

var logger = require("./alias/Logger").getLogger("tests");
logger.info("loading tests.js");

require("./model/natif/Arrays");
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

require("./model/data/enums");
expect = require("rauricoste-tests");
