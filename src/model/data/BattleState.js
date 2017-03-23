var Meta = require("../../alias/Meta");
var Building = require("./Building");
var Dice = require("./Dice");

var BattleState = Meta.createClass("BattleState", {
  random: 1,
  player: "Player",
  units: [],
  buildings: [],
  decision: "",
  loss: 1,
  resolvedLoss: "Unit",
  _init: function() {
    this.strength = this.units.length + this.buildings.length;
    // TODO count defensive buildings
    this.score = this.strength + this.getDice();
  },
  getDice: function() {
    return Dice(this.random);
  },
  buildLoss: function(strength) {
    this.loss = (this.score <= strength) ? 1 : 0;
  },
  isLossResolved: function() {
    return (this.loss && this.resolvedLoss) || !this.loss;
  },
  setLoss: function(unit) {
    this.resolvedLoss = unit;
  },
  isFullyResolved: function() {
    return this.isLossResolved() && (this.decision || !this.hasUnits());
  },
  hasUnits: function() {
    return !!(this.units.length - (this.resolvedLoss ? 1 : 0));
  },
  isStaying: function() {
    return this.decision === "stay";
  },
  isRetreating: function() {
    return this.decision === "retreat";
  },
  stay: function() {
    this.decision = "stay";
  },
  retreat: function() {
    this.decision = "retreat";
  }
});

module.exports = BattleState;
