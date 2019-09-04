module.exports = function(UnitType) {
  return class Unit {
    constructor({ ownerId, type, id = Math.random() + "" }) {
      this.id = id;
      this.ownerId = ownerId;
      this.type = new UnitType(type);
    }
    copy(params = {}) {
      return new Unit(Object.assign({}, this, params));
    }
  };
};
