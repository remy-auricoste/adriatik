class Room {
  constructor({ players, accounts } = {}) {
    this.players = players;
    this.accounts = accounts;

    this.accountPlayerMap = buildAccountPlayerMap(accounts, players);
    this.playerAccountMap = reverseMap(this.accountPlayerMap);
  }
  getAccountByPlayerId(playerId) {
    const accountId = this.playerAccountMap[playerId];
    return this.accounts.find(account => account.id === accountId);
  }
}
const buildAccountPlayerMap = (accounts, players) => {
  if (accounts.length !== players.length) {
    throw new Error(`you must provide the same number of accounts and players`);
  }
  const result = {};
  accounts.forEach((account, index) => {
    result[account.id] = players[index].id;
  });
  return result;
};
const reverseMap = map => {
  const result = {};
  Object.keys(map).forEach(key => {
    result[map[key]] = key;
  });
  return result;
};

module.exports = Room;
