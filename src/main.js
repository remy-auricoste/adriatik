require("./test/env");

require("./model/natif/Arrays");
require("./model/natif/Errors");
require("./model/natif/Strings");
require("./model/data/enums");

var XGame = require('./components/XGame');
var Store = require("rauricoste-store");
var Actions = require("./Actions");

var initState = {};
window.store = new Store(initState);
window.Actions = Actions(store);

ReactDOM.render(<XGame />, document.getElementById('app'));

