const all = [];

class CreatureCard {
  constructor({ name, targetTypes, action }) {
    this.name = name;
    this.targetTypes = targetTypes;
    this.action = action;
    this.id = name;

    if (typeof this.action !== "function") {
      throw new Error("you must define this.action as a function");
    }
  }
  apply(game, player, args) {
    this.action(game, player, args[0], args[1], args[2], args[3]);
  }
}

const createCard = params => {
  const card = new CreatureCard(Object.assign({}, params, { addToEnum: true }));
  CreatureCard[card.name] = card;
  all.push(card);
};

createCard({
  name: "Pégase",
  targetTypes: [["Unit"], "Territory"],
  action: function(game, player, units, territory) {}
});
createCard({
  name: "armée des morts",
  targetTypes: [],
  action: function(game, player) {
    var income = player.lastIncome;
    player.gold += income;
    // TODO message
  }
});
createCard({
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
createCard({
  name: "Kraken",
  targetTypes: ["Territory"],
  action: function(game, player, territory) {}
});
createCard({
  name: "Harpie",
  targetTypes: ["Territory"],
  action: function(game, player, territory) {
    var units = territory.units.filter(unit => {
      return unit.type.id === UnitType.Legionnaire.id && unit.owner !== player;
    });
    if (units.length) {
      territory.units.splice(territory.units.indexOf(units[0]), 1);
    }
    // TODO message
  }
});
createCard({
  name: "Minotaure",
  targetTypes: ["Territory"],
  action: function(game, player, territory) {}
});
createCard({
  name: "Méduse",
  targetTypes: ["Territory"],
  action: function(game, player, territory) {}
});
createCard({
  name: "Cyclope",
  targetTypes: ["Territory"],
  action: function(game, player, territory) {}
});
createCard({
  name: "Centaure",
  targetTypes: ["Territory"],
  action: function(game, player, territory) {}
});
createCard({
  name: "Sphinx",
  targetTypes: [],
  action: function(game, player) {
    // TODO activate state on player so that he can trade cards / units for 2 gold
  }
});
CreatureCard.all = all;

module.exports = CreatureCard;
