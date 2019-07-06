module.exports = function(
  Player,
  Territory,
  TerritoryType,
  Unit,
  UnitType,
  Game,
  God
) {
  const player = new Player({ gold: 7, id: "player" });
  return {
    player,
    territory: new Territory({ type: TerritoryType.earth, buildSlots: 4 }),
    legionnaire: new Unit({ ownerId: player.id, type: UnitType.Legionnaire }),
    game: new Game(),
    god: God.Minerve
  };
};
