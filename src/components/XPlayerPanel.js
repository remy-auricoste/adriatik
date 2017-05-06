var Component = require("../core/Component");
var ClassObject = require("./ClassObject");
var gravatarService = require("../services/gravatarService");
var Arrays = require("rauricoste-arrays");

var XPlayerPanel = Component({
  selectPlayer: function(player) {
  },
  render: function() {
    var game = store.getState().game;
    return (<div className="XPlayerPanel">
      <section className="player-panel">
          {
            game.players.map((player, index) => {
              return (
                <div className={"player rounded-box "+ClassObject({current: player.name === game.getCurrentPlayer().name})}
                        key={index}
                        onClick={this.selectPlayer.bind(this, player)}
                        >
                    <div className={"title player-name player-"+player.color}>{player.name}</div>
                    <div className="player-avatar"><img src={gravatarService.getPictureUrl(player.account && player.account.email)} /></div>
                    <div className="resources">
                        <div className="priest adk-tooltip" title={player.getPriests()+" prêtre(s)"}>
                            {
                              Arrays.seq(0, player.getPriests()).map(index => {
                                return (<img src="/images/priest.png" />);
                              })
                            }
                        </div>
                        <div className="philosopher adk-tooltip" title={player.getPhilosophers()+" philosophe(s)"}>
                            {
                              Arrays.seq(0, player.getPhilosophers()).map(index => {
                                return (<img src="/images/philosopher.png" />);
                              })
                            }
                        </div>
                    </div>
                </div>
              )
            })
          }
      </section>
    </div>)
  }
})

module.exports = XPlayerPanel;
