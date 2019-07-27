const coinSize = 35;

module.exports = function(
  XTooltip,
  God,
  PhaseBid,
  GameActions,
  Arrays,
  XItemPrice
) {
  const commands = new GameActions().commands();
  const { Ceres } = God;
  return ({ game }) => {
    const { gods, bidState } = game;
    const player = game.getCurrentPlayer();
    const possibleBidCommands = Arrays.flatMap(gods, god => {
      return Arrays.seq(1, player.gold + 1).map(amount => {
        try {
          const command = commands.placeBid({ godId: god.id, amount });
          command.apply(game);
          return command;
        } catch (err) {
          return false;
        }
      });
    }).filter(command => !!command);
    possibleBidCommands.map(command =>
      console.log(JSON.stringify(command.args))
    );
    const phase = game.getCurrentPhase();
    const isPhaseBid = phase.constructor === PhaseBid;
    console.log("phase", phase, isPhaseBid);
    return (
      <div className="XBidPanel">
        {gods.map(god => {
          const isCeres = god.id === Ceres.id;
          const bid = bidState.getBidsForGod(god)[0];
          const bidGoldCount = 3;
          const maxPossibleBid = 6;
          console.log("bid", bid);
          console.log("god", god);
          const unitPrices = god.getUnitPrices();
          return (
            <div key={god.id} style={{ display: "flex" }}>
              <div className="god-avatar">
                <XTooltip title={god.name}>
                  <img src="/images/gods/jupiter.png" />
                </XTooltip>
              </div>
              <div className="content-container">
                {isPhaseBid && (
                  <div className="gold-container" style={{ display: "flex" }}>
                    {Arrays.seq(0, maxPossibleBid).map(index => {
                      const gold = index + 1;
                      return (
                        <XTooltip
                          key={index}
                          title={`${
                            isCeres ? "Gagner" : "Miser"
                          } ${gold} sesterce(s)`}
                          display={gold > bidGoldCount}
                        >
                          <div
                            key={index}
                            style={{
                              backgroundColor:
                                gold === bidGoldCount ? "red" : "transparent",
                              borderRadius: "10em",
                              border:
                                gold < bidGoldCount
                                  ? "solid 1px black"
                                  : "none",
                              width: coinSize,
                              height: coinSize
                            }}
                          >
                            {gold > bidGoldCount && (
                              <img src="/images/sesterce.png" />
                            )}
                          </div>
                        </XTooltip>
                      );
                    })}
                  </div>
                )}
                {god.building && (
                  <XItemPrice
                    price={2}
                    iconName={god.building.id}
                    name={god.building.label}
                  />
                )}
                {god.unitType &&
                  unitPrices.length &&
                  unitPrices.map(price => {
                    return (
                      <XItemPrice
                        price={price}
                        iconName={god.unitType.id}
                        name={god.unitType.label}
                      />
                    );
                  })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };
};

// var XBidPanel = Component({
//   visibleCoins: function(god) {
//     var state = store.getState();
//     var godBid = god && god.bid && god.bid.gold ? god.bid.gold : 0;
//     var coinsNb = Math.max(state.game.getCurrentPlayer().gold, godBid);
//     return Arrays.seq(1, coinsNb + 1);
//   },
//   placeBid: function(god, value) {
//     var game = store.getState().game;
//     Actions.Game.placeBid(game.getCurrentPlayer(), god, value);
//   },
//   render: function() {
//     var state = store.getState();
//     var game = state.game;
//   }
// });
