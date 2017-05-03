var Component = require("../core/Component");
var ClassObject = require("./ClassObject");

var XCreaturePanel = Component({
  selectCreature: function(creature) {
  },
  render: function() {
    var state = store.getState();
    var game = state.game;
    var selectedCreature = state.selectedCreature;
    return (<div className="XCreaturePanel">
        <div className="creature-panel rounded-box shadowed-box">
          <div className="title">Créatures</div>
          <div className="creature-container">
            {
                game.creatures.map((creature, index) => {
                    return (
                        <div className={"creature clickable "+ClassObject({selected: creature === selectedCreature})}
                             onClick={this.selectCreature.bind(this, creature)}
                             ref={creature}
                             >
                          <div className="image">image</div>
                          <div className="name">{creature.name}</div>
                          <XSesterces number={4 - index} size={35} className="cost" />
                        </div>
                    )
                })
            }

          </div>
        </div>

    </div>)
  }
})

module.exports = XCreaturePanel;
