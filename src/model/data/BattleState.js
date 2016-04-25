var Meta = require("../../alias/Meta");
var Building = require("./Building");
var Dice = require("./Dice");

var BattleState = Meta.createClass("BattleState", {
  random: 1,
  player: "Player",
  units: [],
  buildings: [],
  init: function() {
    this.strength = this.units.length + this.buildings.length;
    // TODO count defensive buildings
    this.score = this.strength + this.getDice();
  },
  getDice: function() {
    return Dice(this.random);
  },
  getLoss: function(strength) {
    return (this.score <= strength) ? 1 : 0;
  }
});

module.exports = BattleState;
