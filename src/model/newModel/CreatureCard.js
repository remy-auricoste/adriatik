const all = [];

class CreatureCard {
  constructor({ name, targetTypes, action, addToEnum = true }) {
    this.name = name;
    this.targetTypes = targetTypes;
    this.action = action;

    if (typeof this.action !== "function") {
      throw new Error("you must define this.action as a function");
    }
    if (addToEnum) {
      CreatureCard[this.name] = this;
      all.push(this);
    }
  }
  apply(game, player, args) {
    this.action(game, player, args[0], args[1], args[2], args[3]);
  }
}

new CreatureCard({
  name: "Pégase",
  targetTypes: [["Unit"], "Territory"],
  action: function(game, player, units, territory) {}
});
new CreatureCard({
  name: "armée des morts",
  targetTypes: [],
  action: function(game, player) {
    var income = player.lastIncome;
    player.gold += income;
    // TODO message
  }
});
new CreatureCard({
  name: "Griffon",
  targetTypes: ["Player"],
  action: function(game, player, stolenPlayer) {
    var initGold = stolenPlayer.gold;
    var stolenGold = Math.floor(initGold / 2);
    player.gold += stolenGold;
    stolenPlayer.gold -= stolenGold;
    // TODO emit message command
  }
});
new CreatureCard({
  name: "Kraken",
  targetTypes: ["Territory"],
  action: function(game, player, territory) {}
});
new CreatureCard({
  name: "Harpie",
  targetTypes: ["Territory"],
  action: function(game, player, territory) {
    var units = territory.units.filter(function(unit) {
      return unit.type === UnitType.Legionnaire && unit.owner !== player;
    });
    if (units.length) {
      territory.units.splice(territory.units.indexOf(units[0]), 1);
    }
    // TODO message
  }
});
new CreatureCard({
  name: "Minotaure",
  targetTypes: ["Territory"],
  action: function(game, player, territory) {}
});
new CreatureCard({
  name: "Méduse",
  targetTypes: ["Territory"],
  action: function(game, player, territory) {}
});
new CreatureCard({
  name: "Cyclope",
  targetTypes: ["Territory"],
  action: function(game, player, territory) {}
});
new CreatureCard({
  name: "Centaure",
  targetTypes: ["Territory"],
  action: function(game, player, territory) {}
});
new CreatureCard({
  name: "Sphinx",
  targetTypes: [],
  action: function(game, player) {
    // TODO activate state on player so that he can trade cards / units for 2 gold
  }
});
CreatureCard.all = all;

module.exports = CreatureCard;
