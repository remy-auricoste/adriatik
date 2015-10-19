var UnitType = Meta.declareClass("UnitType", {
  name: "", // earth / sea / elite
  territoryType: "", // earth / sea
  init: function() {
    UnitType.all[this.name] = this;
  }
});
UnitType.all = {};
