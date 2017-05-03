var logger = require("../alias/Logger").getLogger("game");
var Component = require("../core/Component");

var XIntroPanel = require("./XIntroPanel");
var XHelper = require("./XHelper");
var XBidPanel = require("./XBidPanel");
var XMap = require("./XMap");
var XActionPanel = require("./XActionPanel");
var XPlayerPanel = require("./XPlayerPanel");
var XErrorPanel = require("./XErrorPanel");
var XCreaturePanel = require("./XCreaturePanel");
var XBattlePanel = require("./XBattlePanel");

var XGame = Component({
  componentDidMount: function() {
    store.subscribe(() => this.forceUpdate());
  },
  render: function() {
    var state = store.getState();
    logger.info(state);
    return (<div className="XGame">
          <XIntroPanel />
          <XHelper />
          <XBidPanel />
          <XMap />
          <XActionPanel />
          <XPlayerPanel />
          <XErrorPanel />
          <XCreaturePanel />
          <XBattlePanel />
    </div>)
  }
})

module.exports = XGame;

// TODO what to do with this ?
//            scope.ready = false;
//            var playerSize = $route.current.params.playerSize;
//            playerSize = parseInt(playerSize);
//            if (isNaN(playerSize)) {
//              playerSize = 0;
//            }
//            gameInitializer.init(playerSize).then(function(game) {
//              logger.info("ready", game);
//              scope.game = game;
//              commandCenter.setGame(game);
//              commandCenter.linkScope(scope);
//              scope.ready = true;
//              scope.$apply();
//            }).catch(function(err) {
//              logger.info("error when initializing the game");
//              console.error(err);
//            });
//
//            $rootScope.$on("select.mode", function(event, value) {
//              $rootScope.mode = value;
//            });
