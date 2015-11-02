var CreatureCard = Meta.declareClass("CreatureCard", {
    _primary: "name",
    name: "",
    action: "fct",
    targetCount: 1,
    init: function() {
      CreatureCard.all[this.name] = this;
      if (!this.targetCount) {
        this.targetCount = 0;
      }
      if (typeof this.action !== "function") {
        throw new Error("you must define this.action as a function");
      }
    },
    apply: function(game, player, args) {
      try {
        if (this.targetCount !== args.length) {
          throw new Error("le nombre de cibles ne correspond pas")
        }
        this.action(game, player, args[0], args[1], args[2], args[3]);
      } catch(err) {
        throw new Error("Impossible d'utiliser la carte "+this.name+" : "+err.message);
      }
    }
});
CreatureCard.all = {};
