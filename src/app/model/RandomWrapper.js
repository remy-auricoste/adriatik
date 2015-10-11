var RandomWrapper = Meta.declareClass("RandomWrapper", {
  value: 1,
  nextFloat: function(min, max) {
    return this.value * (max - min) + min;
  },
  nextInt: function(min, max) {
    return Math.floor(this.nextFloat(min, max));
  }
});
