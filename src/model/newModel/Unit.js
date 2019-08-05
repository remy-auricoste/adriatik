module.exports = function(UnitType) {
  return class Unit {
    constructor({ ownerId, type }) {
      this.ownerId = ownerId;
      this.type = new UnitType(type);
    }
    copy(params = {}) {
      return new Unit(Object.assign({}, this, params));
    }
  };
};
