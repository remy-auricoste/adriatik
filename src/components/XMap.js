const { useState } = React;

module.exports = function(Arrays, XIcon, TerritoryType) {
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

    const { territories } = game;
    return (
      <div className="XMap">
        <svg width="100%" height={window.innerHeight}>
          <g>
            {territories.map((territory, index) => {
              const isOver = territoryOver && territoryOver.id === territory.id;
              return (
                <path
                  key={index}
                  d={territory.path}
                  fill={
                    territory.type === sea
                      ? isOver
                        ? "blue"
                        : "lightblue"
                      : isOver
                      ? "brown"
                      : "orange"
                  }
                  stroke="black"
                  onMouseOver={territoryMouseOver(territory)}
                  onMouseOut={territoryMouseOut(territory)}
                />
              );
            })}
          </g>
        </svg>
        {territories.map((territory, territoryIndex) => {
          const { buildings } = territory;
          const ownerId = territory.getOwner();
          const ownerColor = "red"; // TODO
          var groupedUnits = Arrays.groupBy(territory.units, unit => {
            return unit.type.id + "_" + unit.ownerId;
          });
          return (
            <div
              className="icon-container"
              key={territoryIndex}
              style={{
                left: territory.box.x,
                top: territory.box.y,
                width: territory.box.width,
                height: territory.box.height
              }}
            >
              {/* <XMapCounter
                fileName="sesterce"
                value={territory.getIncome()}
                className={
                  "bg-player-" +
                  ownerColor +
                  " income " +
                  ClassObject({ controlledIncome: territory.owner })
                }
              /> */}
              {Object.keys(groupedUnits).map(key => {
                var unitGroup = groupedUnits[key];
                var firstUnit = unitGroup[0];
                var color =
                  firstUnit.owner &&
                  game.getPlayerByName(firstUnit.owner).color;
                return (
                  <XMapCounter
                    key={key}
                    fileName={firstUnit.type.name}
                    value={unitGroup.length}
                    className={"bg-player-" + color + " player-unit clickable"}
                    onClick={this.select.bind(this, territory, firstUnit)}
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
