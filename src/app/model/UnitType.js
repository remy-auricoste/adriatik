var UnitType = Meta.declareClass("UnitType", {
    name: "", // earth / sea / gladiator
    label: "", // terre / mer / gladiateur
    territoryType: "", // earth / sea
    init: function () {
        UnitType.all[this.name] = this;
    }
});
UnitType.all = {};
