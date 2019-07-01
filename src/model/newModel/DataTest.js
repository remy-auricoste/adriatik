module.exports = function(Player, Territory, TerritoryType) {
  return {
    player: new Player({ gold: 7 }),
    territory: new Territory({ type: TerritoryType.earth, buildSlots: 4 })
  };
};
