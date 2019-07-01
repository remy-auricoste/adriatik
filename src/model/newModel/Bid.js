module.exports = class Bid {
  constructor({ godId, playerId, amount }) {
    Object.assign(this, arguments[0]);
  }
};
