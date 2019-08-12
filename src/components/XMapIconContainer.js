module.exports = function(Arrays, XIcon, XIconCount, store, MoveActions) {
  return ({ game }) => {
    const { room } = store.getState();
    const { territories } = game;
    const {
      player: currentPlayer,
      god: currentGod
    } = game.getCurrentPlayerAndGod();
    const selectedUnits = MoveActions.getSelectedUnits();

    const handleClickUnit = (unitKind, territory, valid) => {
      if (!valid) {
        return;
      }
      return () => {
        const newUnit = territory.units.find(
          unit =>
            unit.ownerId === unitKind.ownerId &&
            unit.type.id === unitKind.type.id &&
            selectedUnits.indexOf(unit) === -1
        );
        if (!newUnit) {
          throw new Error(`could not select a new unit`);
        }
        MoveActions.select(newUnit, territory);
      };
    };

    return (
      <div className="XMapIconContainer">
        {territories.map(territory => {
          const { buildings = [], tiles, units } = territory;
          const income = territory.getIncome();

          var groupedUnits = Arrays.groupBy(units, unit => {
            return unit.type.id + "_" + unit.ownerId;
          });
          const renderedUnits = Object.keys(groupedUnits).map(key => {
            const unitGroup = groupedUnits[key].filter(
              unit => selectedUnits.indexOf(unit) === -1
            );
            const firstUnit = unitGroup[0];
            if (!firstUnit) {
              return null;
            }
            const { color } = room.getAccountByPlayerId(firstUnit.ownerId);
            const { ownerId, type: unitType } = firstUnit;
            const isCurrentPlayerUnit = currentPlayer.id === ownerId;
            const isMovable =
              isCurrentPlayerUnit &&
              currentGod &&
              currentGod.unitType &&
              unitType.id === currentGod.unitType.id;
            return (
              <XIconCount
                key={key}
                fileName={firstUnit.type.id}
                value={unitGroup.length}
                color={color}
                onClick={handleClickUnit(firstUnit, territory, isMovable)}
              />
            );
          });
          const renderedIncome = income
            ? [
                <XIconCount
                  fileName="cornucopia"
                  value={territory.getIncome()}
                />
              ]
            : [];
          const renderedBuildings = buildings.map((building, buildingIndex) => {
            return (
              <XIcon
                key={buildingIndex}
                fileName={building.id}
                size={30}
                shape="square"
              />
            );
          });
          const renderedAll = renderedIncome
            .concat(renderedBuildings)
            .concat(renderedUnits);

          const squareSize = 50;
          return tiles.map(({ x, y }, tileIndex) => (
            <div
              key={tileIndex}
              style={{
                position: "absolute",
                top: y - squareSize / 2,
                left: x - squareSize / 2,
                width: squareSize,
                height: squareSize,
                zIndex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                pointerEvents: "none"
              }}
            >
              {renderedAll
                .filter(
                  (renderedIcon, iconIndex) =>
                    iconIndex % tiles.length === tileIndex
                )
                .map((renderedIcon, index) => (
                  <div key={index}>{renderedIcon}</div>
                ))}
            </div>
          ));
        })}
      </div>
    );
  };
};
