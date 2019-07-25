var XItemPrice = require("./XItemPrice");

var CommandType = require("../model/data/CommandType");
var Phases = require("../model/data/Phases");

var iconSize = 40;

var XActionPanel = Component({
  selectMode: function(mode) {
    if (state.mode === mode) {
      Actions.selectCommand(null);
    } else {
      Actions.resetSelection();
      Actions.selectCommand(mode);
    }
  },
  endTurn: function() {
    Actions.Game.endPlayerTurn();
  },
  render: function() {
    var state = store.getState();
    var mode = state.command && state.command.type;
    var game = state.game;
    var god = game.getPlayerGod(game.getCurrentPlayer());
    var currentPlayer = game.getCurrentPlayer();
    var unitBuyCount = currentPlayer.unitBuyCount;
    var cardBuyCount = currentPlayer.cardBuyCount;
    return (
      <div className="XActionPanel">
        <div className="title">Actions</div>
        <div className="actions">
          {(() => {
            if (game.turn > 1 && game.phase === Phases.actions) {
              return (
                <div>
                  <div
                    className="action-building"
                    onClick={this.selectMode.bind(this, CommandType.Build)}
                  >
                    <XItemPrice
                      price={2}
                      iconSize={iconSize}
                      iconName={god.building && god.building.name}
                      className={ClassObject({
                        selected: mode === CommandType.Build,
                        hidden: !god.building
                      })}
                    />
                  </div>
                  <div
                    className={
                      "action-unit " +
                      ClassObject({
                        hidden: !god.unitType,
                        selected: mode === CommandType.BuyUnit
                      })
                    }
                    onClick={this.selectMode.bind(this, CommandType.BuyUnit)}
                  >
                    {god.unitPrice &&
                      god
                        .unitPrice()
                        .slice(unitBuyCount, unitBuyCount + 1)
                        .map((price, index) => {
                          return (
                            <XItemPrice
                              key={index}
                              price={price}
                              iconSize={iconSize}
                              iconName={god.unitType.name}
                              className={ClassObject({
                                selected: mode === CommandType.Build,
                                hidden: !god.unitType
                              })}
                            />
                          );
                        })}
                  </div>
                  <div
                    className={
                      "action-card " +
                      ClassObject({
                        selected: mode === CommandType.BuyCard,
                        hidden: !god.card
                      })
                    }
                    onClick={this.selectMode.bind(this, CommandType.BuyCard)}
                  >
                    {god.cardPrice &&
                      god
                        .cardPrice()
                        .slice(cardBuyCount, cardBuyCount + 1)
                        .map((price, index) => {
                          return (
                            <XItemPrice
                              key={index}
                              price={price}
                              iconSize={iconSize}
                              iconName={god.card.name}
                            />
                          );
                        })}
                  </div>
                </div>
              );
            }
          })()}
          <div
            className={
              "action-end-turn " +
              ClassObject({ hidden: game.phase !== Phases.actions })
            }
          >
            <input type="button" value="Fin de tour" onClick={this.endTurn} />
          </div>
        </div>
      </div>
    );
  }
});

module.exports = XActionPanel;
