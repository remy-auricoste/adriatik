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
  },
  getDices: function() {
    return this.dices;
  },
  getLoosers: function() {
    var territory = this.territory;
    var strength1 = this.strengths[0];
    var strength2 = this.strengths[1];
    var loss1 = strength1 <= strength2 ? 1 : 0;
    var loss2 = strength2 <= strength1 ? 1 : 0;
    var result = [];
    if (loss1) {
      result.push(this.player1);
    }
    if (loss2) {
      result.push(this.player2);
    }
    return result;
  }
});

module.exports = Battle;
