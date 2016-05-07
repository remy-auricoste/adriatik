var Meta = require("../../alias/Meta");
var Building = require("./Building");
var BattleState = require("./BattleState");
var Dice = require("./Dice");

var Battle = Meta.createClass("Battle", {
  territory: "Territory",
  states: ["BattleState"],
  getStates: function() {
    if (this.states && this.states.length) {
      this.states[0].buildLoss(this.states[1].score);
      this.states[1].buildLoss(this.states[0].score);
    }
    return this.states;
  },
  getDices: function() {
    return this.getStates().map(function(state) {
      return state.getDice();
    });
  },
  getLoosers: function() {
    return this.getStates().filter(function(state) {
      return state.loss;
    }).map(function(state) {
      return state.player;
    })
  },
  getDefender: function() {
    return this.states[0].player;
  },
  getAttacker: function() {
    return this.states[1].player;
  },
  isLossResolved: function() {
    return this.getStates().forall(function(state) {
      return state.isLossResolved();
    });
  },
  isFullyResolved: function() {
    return this.getStates().forall(function(state) {
      return state.isFullyResolved();
    }) || this.isLossResolved() && this.getStates().filter(function(state) {
      return !state.hasUnits();
    }).length;
  },
  getState: function(player) {
    return this.getStates().filter(function(state) {
      return state.player === player;
    })[0];
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
