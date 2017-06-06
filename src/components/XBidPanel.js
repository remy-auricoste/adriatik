var Arrays = require("rauricoste-arrays");

var Component = require("../core/Component");
var ClassObject = require("./ClassObject");

var Phases = require("../model/data/Phases");
var God = require("../model/data/God");

var XBidPanel = Component({
  visibleCoins: function(god) {
    var state = store.getState();
    var godBid = (god && god.bid && god.bid.gold) ? god.bid.gold : 0;
    var coinsNb = Math.max(state.game.getCurrentPlayer().gold, godBid);
    return Arrays.seq(1, coinsNb+1);
  },
  placeBid: function(god, value) {
    var game = store.getState().game;
    Actions.Game.placeBid(game.getCurrentPlayer(), god, value);
  },
  render: function() {
    var state = store.getState();
    var game = state.game;
    return (<div className="XBidPanel">
            <debug-panel game="game"></debug-panel>
            <div className="phase">{game.phase}: {game.turn}</div>
            {
              game.currentGods.map(god => {
                var isPhaseActions = game.phase === Phases.actions;
                var bids = game.getBidsForGod(god);
                var lastBid = bids[bids.length - 1];
                var player = lastBid && game.getPlayerByName(lastBid.player);
                var playerColor = player && player.color;
                return (<div className={"god "+god.name+" "+(isPhaseActions && playerColor ? "player-"+playerColor : "")+" "+ClassObject({selected: isPhaseActions && player === game.getCurrentPlayer()})}
                             key={god.name}
                             >
                      <div className="god-avatar">
                          <img src="/images/gods/jupiter.png" />
                          <div className="god-tooltip" >
                              {
                                (() => {
                                  if (god.building) {
                                    return (<div><img src={"/images/"+god.building.name+".png"} />{god.building.label}</div>)
                                  }
                                })()
                              }
                              {
                                (() => {
                                  if (god.unitType) {
                                    return (<div><img src={"/images/"+god.unitType.name+".png"} />{god.unitType.label}</div>)
                                  }
                                })()
                              }
                          </div>
                      </div>
                      <div className="content-container">
                        <div className="god-name">{god.name}</div>
                        {
                          (() => {
                            if (isPhaseActions && player) {
                              return (<div className="player-name">{player.name}</div>)
                            }
                          })()
                        }
                        {
                          (() => {
                            if (game.phase === Phases.bidding) {
                              return (
                                <div className="gold-container">
                                    {
                                      this.visibleCoins(god)
                                        .filter(gold => {
                                          return gold === 1 || god !== God.Ceres;
                                        })
                                        .map(gold => {
                                          return (<div className={"gold "+(lastBid && player && gold <= lastBid.amount ? ("bidden bidden-player-"+playerColor) : "")}
                                                       onClick={this.placeBid.bind(this, god, gold)}
                                                       key={gold}
                                                       >
                                              <span className="adk-tooltip" title={(god === God.Ceres ? "Gagner" : "Miser")+" "+gold+" sesterce(s)"}>
                                                  <img src="/images/sesterce.png" className={ClassObject({hidden: player && gold <= lastBid.amount})} />
                                              </span>
                                          </div>)
                                      })
                                    }
                                </div>
                              )
                            }
                          })()
                        }
                      </div>
                </div>)
              })
            }
    </div>)
  }
})

module.exports = XBidPanel;
