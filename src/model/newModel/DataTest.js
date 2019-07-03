module.exports = function(Player, Territory, TerritoryType, Unit, UnitType) {
  const player = new Player({ gold: 7 });
  return {
    player,
    territory: new Territory({ type: TerritoryType.earth, buildSlots: 4 }),
    legionnaire: new Unit({ ownerId: player.id, type: UnitType.Legionnaire })
  };
};
