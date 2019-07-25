require("./model/natif/Errors");
require("./model/natif/Strings");

const RandomReaderAsync = require("./services/RandomReaderAsync");
const Random = require("rauricoste-random").simple;
const randomReaderAsync = RandomReaderAsync(Random);

const Injector = require("./Injector");
const injector = new Injector();
Injector.instance = injector;
injector.add("randomReaderAsync", randomReaderAsync);

const newModelIndex = require("./model/newModel/index");
injector.addAll(newModelIndex);
const battleIndex = require("./model/newModel/battle/index");
injector.addAll(battleIndex);

const XRoot = require("./components/XRoot");

// var Store = require("rauricoste-store");
// var Actions = require("./Actions");
// GameCreator.create(4, "standard").then(game => {
//   var initState = {
//     game: HistoryService.getState() || game
//   };
//   logger.info("initState", initState);
//   window.store = new Store(initState);
//   window.Actions = Actions(window.store);

// });

ReactDOM.render(<XRoot />, document.getElementById("app"));
