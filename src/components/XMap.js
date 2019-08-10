const { useState } = React;

module.exports = function(
  Arrays,
  XIcon,
  TerritoryType,
  GameActions,
  commandHandler,
  XMapCounter,
  store,
  SelectionActions
) {
  const gameActions = new GameActions();
  const commands = gameActions.commands();
  const { sea } = TerritoryType;
  return ({ game }) => {
    const [territoryOver, setTerritoryOver] = useState(null);

    const { room } = store.getState();
    const { territories } = game;
    const {
      player: currentPlayer,
      god: currentGod
    } = game.getCurrentPlayerAndGod();

    const territoryMouseOver = territory => () => {
      setTerritoryOver(territory);
    };
    const territoryMouseOut = territory => () => {
      if (territoryOver === territory) {
        setTerritoryOver(null);
      }
    };
    const territoryClick = territory => () => {
      SelectionActions.select(territory);
      if (gameActions.canDo({ actionType: "initUnit", game })) {
        const command = commands.initUnit({ territoryId: territory.id });
        commandHandler({ command });
      }
    };
    const handleClickUnit = (unitKind, valid) => {
      if (!valid) {
        return;
      }
      return () => {
        console.log("click", unitKind);
      };
    };

    return (
      <div className="XMap">
        <svg width="100%" height={window.innerHeight}>
          <g>
            {territories.map((territory, index) => {
              const isOver = territoryOver && territoryOver.id === territory.id;
              const isNeighbour =
                territoryOver && territory.isNextTo(territoryOver);
              const changeColor = isOver || isNeighbour;
              const isSea = territory.type === sea;
              const defaultColor = isSea
                ? changeColor
                  ? "#79c8e2"
                  : "lightblue"
                : changeColor
                ? "#e89600"
                : "orange";
              return (
                <path
                  key={index}
                  d={territory.path}
                  fill={defaultColor}
                  stroke="black"
                  onMouseOver={territoryMouseOver(territory)}
                  onMouseOut={territoryMouseOut(territory)}
                  onClick={territoryClick(territory)}
                />
              );
            })}
          </g>
        </svg>
        {territories.map((territory, territoryIndex) => {
          const { buildings } = territory;
          var groupedUnits = Arrays.groupBy(territory.units, unit => {
            return unit.type.id + "_" + unit.ownerId;
          });
          return (
            <div
              className="icon-container"
              key={territoryIndex}
              style={{
                position: "absolute",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                left: territory.box.x,
                top: territory.box.y,
                width: territory.box.width,
                height: territory.box.height,
                pointerEvents: "none"
              }}
            >
              <XMapCounter
                fileName="cornucopia"
                value={territory.getIncome()}
                color="#ece200"
              />
              {Object.keys(groupedUnits).map(key => {
                var unitGroup = groupedUnits[key];
                var firstUnit = unitGroup[0];
                const { color } = room.getAccountByPlayerId(firstUnit.ownerId);
                const { ownerId, type: unitType } = firstUnit;
                const isCurrentPlayerUnit = currentPlayer.id === ownerId;
                const isMovable =
                  isCurrentPlayerUnit &&
                  currentGod &&
                  currentGod.unitType &&
                  unitType.id === currentGod.unitType.id;
                return (
                  <XMapCounter
                    key={key}
                    fileName={firstUnit.type.id}
                    value={unitGroup.length}
                    color={color}
                    onClick={handleClickUnit(firstUnit, isMovable)}
                  />
                );
              })}
              {buildings &&
                buildings.map((building, index) => {
                  return (
                    <XIcon fileName={building.name} size={20} key={index} />
                  );
                })}
            </div>
          );
        })}
      </div>
    );
  };
};
