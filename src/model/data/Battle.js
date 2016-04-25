var Meta = require("../../alias/Meta");
var Building = require("./Building");
var BattleState = require("./BattleState");
var Dice = require("./Dice");

var Battle = Meta.createClass("Battle", {
  territory: "Territory",
  states: ["BattleState"],
  getDices: function() {
    return this.states.map(function(state) {
      return state.getDice();
    });
  },
  getLosses: function() {
    if (!this.losses) {
      this.losses = [
        this.states[0].getLoss(this.states[1].score),
        this.states[1].getLoss(this.states[0].score)
      ];
    }
    return this.losses;
  },
  getLoss: function(player) {
    var index = Meta.findIndex(this.states, function(state) {
      return state.player === player;
    });
    return this.getLosses()[index];
  },
  getLoosers: function() {
    var loosers = [];
    if (this.getLosses()[0]) {
      loosers.push(this.states[0].player);
    }
    if (this.getLosses()[1]) {
      loosers.push(this.states[1].player);
    }
    return loosers;
  }
});
Battle.new = function(randoms, territory) {
  var player1 = territory.owner;
  var player2 = territory.units.filter(function(unit) {
    return unit.owner !== player1;
  })[0].owner;
  var getDefensiveBuildings = function(player) {
    if (player === player2) {
      return [];
    }
    // TODO add metropoles
    return territory.buildings.filter(function(building) {
      return building === Building.Fort;
    });
  }

  var battleState1 = new BattleState({
    random: randoms[0],
    player: player1,
    units: territory.getUnits(player1),
    buildings: getDefensiveBuildings(player1),
  });
  var battleState2 = new BattleState({
    random: randoms[1],
    player: player2,
    units: territory.getUnits(player2),
    buildings: getDefensiveBuildings(player2),
  });

  return new Battle({
    territory: territory,
    states: [battleState1, battleState2]
  });
}

module.exports = Battle;
