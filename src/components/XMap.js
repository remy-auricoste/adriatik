var Arrays = require("rauricoste-arrays");

var Component = require("../core/Component");
var ClassObject = require("./ClassObject");

var XMapCounter = require("./XMapCounter");
var XIf = require("./XIf");
var XIcon = require("./XIcon");

var Territory = require("../model/data/Territory");
var Phases = require("../model/data/Phases");
var CommandType = require("../model/data/CommandType");

var XMap = Component({
  setOver: function(territory, value) {
    var game = store.getState().game;
    territory.over = value;
    territory.neighbours.map(function (id) {
        var neighbour = game.getTerritory(id);
        neighbour.isNeighbour = value;
    })
    this.forceUpdate();
  },
  onMouseOver: function(territory) {
    this.setOver(territory, true);
  },
  onMouseOut: function(territory) {
    this.setOver(territory, false);
  },
  onClick: function(territory) {
    var state = store.getState();
    var game = state.game;
    if (game.turn === 1 && game.phase === Phases.actions) {
        Actions.Game.initUnit(game.getCurrentPlayer().name, territory.index);
    } else if (state.command && state.command.type) {
        Actions.fillCommand(territory);
    }
  },
  select: function(territory, unit) {
    console.log("select", territory, unit);
  },
  render: function() {
    var state = store.getState();
    var game = state.game;
    return (<div className="XMap">
          <section className="map">
            <svg>
                <g>
                    {
                      game.territories.map((territory, index) => {
                          return (<path
                                key={index}
                                d={territory.path}
                                className={"area "+ClassObject({over: territory.over, neighbour: territory.isNeighbour, sea: territory.type === "sea", owned: territory.owner})}
                                onMouseOver={this.onMouseOver.bind(this, territory)}
                                onMouseOut={this.onMouseOut.bind(this, territory)}
                                onClick={this.onClick.bind(this, territory)}
                          />)

                      })
                    }
                </g>
            </svg>
            {
                game.territories.map((territory, territoryIndex) => {
                    var ownerColor = territory.owner && game.getPlayerByName(territory.owner).color;
                    var groupedUnits = Arrays.groupBy(territory.units, function(unit) {
                       return unit.type.name + "_" + unit.owner.color;
                    });
                    return (<div className="icon-container"
                                 key={territoryIndex}
                                 style={{
                                    left: territory.box.x,
                                    top: territory.box.y,
                                    width: territory.box.width,
                                    height: territory.box.height
                                 }}
                                 >
                          <XMapCounter fileName="sesterce"
                                       value={territory.getIncome()}
                                       className={"bg-player-"+ownerColor+" income "+ClassObject({controlledIncome: territory.owner})}
                                       />
                          {
                              Object.keys(groupedUnits).map(key => {
                                  var unitGroup = groupedUnits[key];
                                  var firstUnit = unitGroup[0];
                                  var color = firstUnit.owner && game.getPlayerByName(firstUnit.owner).color;
                                  return (<XMapCounter
                                          key={key}
                                          fileName={firstUnit.type.name}
                                          value={unitGroup.length}
                                          className={"bg-player-"+color+" player-unit clickable"}
                                          onClick={this.select.bind(this, territory, firstUnit)}
                                  />)
                              })
                          }
                          <XIf test={territory.buildings.length}>
                            <div className={"map-counter bg-player-"+ownerColor+" building"}>
                              {
                                  territory.buildings.map((building, index) => {
                                      return (<XIcon fileName={building.name} size={20} key={index} />)
                                  })
                              }
                            </div>
                          </XIf>
                    </div>)
                })
            }
          </section>
    </div>)
  }
})

module.exports = XMap;
