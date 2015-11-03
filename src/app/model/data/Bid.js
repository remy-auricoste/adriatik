var Bid = Meta.declareClass("Bid", {
    godName: "",
    gold: 1,
    getGod: function() {
      return God.byName(this.godName);
    }
});
