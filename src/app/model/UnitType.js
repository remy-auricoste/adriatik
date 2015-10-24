var UnitType = Meta.declareClass("UnitType", {
    name: "", // earth / sea / gladiator
    territoryType: "", // earth / sea
    init: function () {
        UnitType.all[this.name] = this;
    }
});
UnitType.all = {};
