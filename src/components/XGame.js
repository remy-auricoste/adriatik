var XIntroPanel = require("./XIntroPanel");
var XHelper = require("./XHelper");
var XBidPanel = require("./XBidPanel");
var XMap = require("./XMap");
var XActionPanel = require("./XActionPanel");
var XPlayerPanel = require("./XPlayerPanel");
var XErrorPanel = require("./XErrorPanel");
var XCreaturePanel = require("./XCreaturePanel");
var XBattlePanel = require("./XBattlePanel");

var XGame = () => {
  return (
    <div className="XGame">
      <XIntroPanel />
      <XHelper />
      <XBidPanel />
      <XMap />
      <XActionPanel />
      <XPlayerPanel />
      <XErrorPanel />
      <XCreaturePanel />
      <XBattlePanel />
    </div>
  );
};

module.exports = XGame;
