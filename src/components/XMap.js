const { useState } = React;

module.exports = function(
  Arrays,
  XIcon,
  TerritoryType,
  GameActions,
  commandHandler,
  XMapCounter,
  store,
  StoreActions
) {
  const gameActions = new GameActions();
  const commands = gameActions.commands();
  const { sea } = TerritoryType;
  return ({ game }) => {
    const [territoryOver, setTerritoryOver] = useState(null);
    const territoryMouseOver = territory => () => {
      setTerritoryOver(territory);
    };
    const territoryMouseOut = territory => () => {
      if (territoryOver === territory) {
        setTerritoryOver(null);
      }
    };
    const territoryClick = territory => () => {
      StoreActions.select(territory);
      if (gameActions.canDo({ actionType: "initUnit", game })) {
        const command = commands.initUnit({ territoryId: territory.id });
        commandHandler({ command });
      }
    };

    const { room } = store.getState();
    const { territories } = game;
    return (
      <div className="XMap">
        <svg width="100%" height={window.innerHeight}>
          <g>
            {territories.map((territory, index) => {
              const isOver = territoryOver && territoryOver.id === territory.id;
              const isNeighbour =
                territoryOver && territory.isNextTo(territoryOver);
              const changeColor = isOver || isNeighbour;
              const ownerId = territory.getOwner();
              const account = ownerId && room.getAccountByPlayerId(ownerId);
              const ownerColor = account && account.color;
              const isSea = territory.type === sea;
              const defaultColor = isSea
                ? changeColor
                  ? "blue"
                  : "lightblue"
                : changeColor
                ? "brown"
                : "orange";
              return (
                <path
                  key={index}
                  d={territory.path}
                  fill={ownerColor ? ownerColor : defaultColor}
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
              <XMapCounter fileName="sesterce" value={territory.getIncome()} />
              {Object.keys(groupedUnits).map(key => {
                var unitGroup = groupedUnits[key];
                var firstUnit = unitGroup[0];
                return (
                  <XMapCounter
                    key={key}
                    fileName={firstUnit.type.id}
                    value={unitGroup.length}
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
