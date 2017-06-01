require("./test/env");

require("./model/natif/Arrays");
require("./model/natif/Errors");
require("./model/natif/Strings");
require("./model/data/enums");

var logger = require("./alias/Logger").getLogger("main");

var injector = require("./core/MyInjector");

require("./services/GameCreator");
require("./model/data/Game");
require("./model/data/Player");

var XGame = require('./components/XGame');
var Store = require("rauricoste-store");
var Actions = require("./Actions");

var GameCreator = injector.getInstance("GameCreator");

GameCreator.create(4).then(game => {
  var initState = {
    game: game
  };
  logger.info("initState", initState);
  window.store = new Store(initState);
  window.Actions = Actions(window.store);

  ReactDOM.render(<XGame />, document.getElementById('app'));
})


