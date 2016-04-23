var Meta = require("../../alias/Meta");
var Dice = require("./Dice");

var Battle = Meta.createClass("Battle", {
  randoms: [],
  territory: "Territory",
  init: function() {
    var self = this;
    var player1 = this.territory.units[0].owner;
    this.player1 = player1;
    this.player2 = this.territory.units.filter(function (unit) {
      return unit.owner !== player1;
    })[0].owner;
    this.players = [this.player1, this.player2];
    this.dices = this.randoms.map(Dice);
    this.strengths = this.players.map(function(player) {
      return self.territory.getUnits(player).length;
    });
    this.scores = this.strengths.map(function(strength, index) {
      // TODO count defensive buildings
      return strength + self.dices[index];
    });
    this.losses = [this.getLoss(0, 1), this.getLoss(1, 0)];
  },
  getDices: function() {
    return this.dices;
  },
  getLoss: function(index1, index2) {
    return this.scores[index1] <= this.scores[index2] ? 1 : 0;
  },
  getLoosers: function() {
    var loosers = [];
    if (this.losses[0]) {
      loosers.push(this.player1);
    }
    if (this.losses[1]) {
      loosers.push(this.player2);
    }
    return loosers;
  }
});

module.exports = Battle;
