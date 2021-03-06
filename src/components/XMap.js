const { useState } = React;

module.exports = function(
  TerritoryType,
  GameActions,
  commandHandler,
  SelectionActions,
  MoveActions,
  XMapIconContainer,
  God
) {
  const { Ceres } = God;
  const commands = GameActions.commands();
  const { sea } = TerritoryType;
  return ({ game }) => {
    const [territoryOver, setTerritoryOver] = useState(null);

    const { territories } = game;
    const currentGod = game.getCurrentGod();

    const territoryMouseOver = territory => () => {
      setTerritoryOver(territory);
    };
    const territoryMouseOut = territory => () => {
      if (territoryOver === territory) {
        setTerritoryOver(null);
      }
    };
    const territoryClick = territory => () => {
      if (currentGod && currentGod.id === Ceres.id) {
        SelectionActions.selectAction("addIncome");
      }
      SelectionActions.select(territory);
      MoveActions.selectTerritory(territory);
      if (GameActions.canDo({ actionType: "initUnit", game })) {
        const command = commands.initUnit({ territoryId: territory.id });
        commandHandler({ command });
      }
    };
    return (
      <div className="XMap">
        <XMapIconContainer game={game} />
        <svg width="100%" height={window.innerHeight}>
          <g>
            {territories.map((territory, index) => {
              const isOver = territoryOver && territoryOver.id === territory.id;
              const isNeighbour =
                territoryOver && territory.isNextTo(territoryOver);
              const changeColor =
                isOver ||
                isNeighbour ||
                MoveActions.isValidSeaDestination(territory);
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
      </div>
    );
  };
};
