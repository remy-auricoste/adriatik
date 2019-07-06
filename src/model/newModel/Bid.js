module.exports = class Bid {
  constructor({ godId, playerId, amount }) {
    this.godId = godId;
    this.playerId = playerId;
    this.amount = amount;
  }
};
