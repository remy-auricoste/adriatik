var Meta = require("../../alias/Meta");

var CreatureCard = Meta.declareClass("CreatureCard", {
    _primary: "name",
    name: "",
    action: "fct",
    targetTypes: [],
    init: function() {
      CreatureCard.all[this.name] = this;
      if (!this.targetTypes) {
        this.targetTypes = [];
      }
      if (typeof this.action !== "function") {
        throw new Error("you must define this.action as a function");
      }
    },
    checkType: function(def, value) {
      var self = this;
      if (!value) {
        throw new Error("creature arg is undefined");
      }
      if (def.constructor === Array && value.constructor !== Array) {
        throw new Error("expected constructor "+def.constructor.name+" but got "+JSON.stringify(value));
      }

      if (def.constructor === Array) {
        var defType = def[0];
        value.map(function(subValue) {
          self.checkType(defType, subValue);
        })
      } else if(def.constructor === String) {
        if (value.constructor.className !== def) {
          throw new Error("expected type "+def+" but got type "+value.constructor.className);
        }
      }
    },
    apply: function(game, player, args) {
      var self = this;
      try {
        if (this.targetTypes.length !== args.length) {
          throw new Error("le nombre de cibles ne correspond pas. expected "+this.targetTypes.length+", got "+args.length);
        }
        self.targetTypes.map(function(type, index) {
          self.checkType(type, args[index]);
        });
        this.action(game, player, args[0], args[1], args[2], args[3]);
      } catch(err) {
        throw err.prefix("Impossible d'utiliser la carte "+this.name+" : ");
      }
    }
});
CreatureCard.all = {};

module.exports = CreatureCard;
