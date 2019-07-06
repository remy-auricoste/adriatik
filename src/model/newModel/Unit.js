module.exports = class Unit {
  constructor({ ownerId, type }) {
    this.ownerId = ownerId;
    this.type = type;
  }
  copy(params = {}) {
    return new Unit(Object.assign({}, this, params));
  }
};
