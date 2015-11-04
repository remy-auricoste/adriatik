var Battle = Meta.createClass("Battle", {
  randoms: [],
  territory: "Territory",
  getDices: function() {
    return this.randoms.map(Dice);
  },
  getLoosers: function() {
    var territory = this.territory;
    var owner1 = territory.units[0].owner;
    var owner2 = territory.units.filter(function (unit) {
        return unit.owner !== owner1;
    })[0].owner;
    var getStrength = function (owner, randomValue) {
        // TODO count defensive buildings
        return territory.getUnits(owner).length + Dice(randomValue);
    }
    var strength1 = getStrength(owner1, this.randoms[0]);
    var strength2 = getStrength(owner2, this.randoms[1]);
    var loss1 = strength1 <= strength2 ? 1 : 0;
    var loss2 = strength2 <= strength1 ? 1 : 0;
    var result = [];
    if (loss1) {
      result.push(owner1);
    }
    if (loss2) {
      result.push(owner2);
    }
    return result;
  }

})
