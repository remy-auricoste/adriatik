require("./test/window");

var env = require("./test/env");
env.mode = "test";

var logger = require("./alias/Logger").getLogger("tests");
logger.info("loading tests.js");

require("./model/natif/Arrays");
require("./model/natif/Errors");
require("./model/natif/Strings");

require("./model/data/enums");
expect = require("rauricoste-tests");
