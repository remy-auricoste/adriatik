const coinSize = 35;

module.exports = function(
  XTooltip,
  God,
  PhaseBid,
  GameActions,
  Arrays,
  XItemPrice,
  storeCommands,
  XSesterces
) {
  const commands = new GameActions().commands();
  const { Ceres } = God;
  return ({ game }) => {
    const handleBid = (god, amount) => {
      const command = commands.placeBid({ godId: god.id, amount });
      game = command.apply(game);
      if (game.constructor !== Promise) {
        game = Promise.resolve(game);
      }
      game.then(game => {
        storeCommands.set("game", game);
      });
    };

    const { gods, bidState } = game;
    const player = game.getCurrentPlayer();
    const phase = game.getCurrentPhase();
    const isPhaseBid = phase.constructor === PhaseBid;
    return (
      <div className="XBidPanel" style={{ width: 400 }}>
        {gods.map(god => {
          const bid = bidState.getBidsForGod(god)[0];
          if (!bid && !isPhaseBid) {
            return null;
          }

          const isCeres = god.id === Ceres.id;
          const bidGoldCount = (bid && bid.amount) || 0;
          const maxPossibleBid = isCeres ? 1 : player.getMaxBid();
          const unitPrices = god.getUnitPrices();

          const renderedUnitPrices = unitPrices.map((price, index) => {
            return (
              <XItemPrice
                key={index}
                price={price}
                iconName={god.unitType.id}
                name={god.unitType.label}
              />
            );
          });

          return (
            <div
              key={god.id}
              style={{
                display: "flex",
                flexDirection: "column",
                border: "solid 1px black",
                marginTop: 10,
                marginLeft: 10,
                marginRight: 10
              }}
            >
              <div className="gold-container" style={{ display: "flex" }}>
                {isPhaseBid &&
                  Arrays.seq(0, maxPossibleBid).map(index => {
                    const gold = index + 1;
                    const isPossibleBid = gold > bidGoldCount;
                    return (
                      <XTooltip
                        key={index}
                        title={`${
                          isCeres ? "Gagner" : "Miser"
                        } ${gold} sesterce(s)`}
                        display={isPossibleBid}
                      >
                        <div
                          style={{
                            backgroundColor:
                              gold === bidGoldCount ? "red" : "transparent",
                            borderRadius: "10em",
                            border:
                              gold < bidGoldCount ? "solid 1px black" : "none",
                            width: coinSize,
                            height: coinSize
                          }}
                          onClick={() => {
                            isPossibleBid && handleBid(god, gold);
                          }}
                        >
                          {isPossibleBid && <img src="/images/sesterce.png" />}
                        </div>
                      </XTooltip>
                    );
                  })}
                {!isPhaseBid && <XSesterces number={bid.amount} />}
              </div>
              <div style={{ display: "flex" }}>
                <div className="god-avatar">
                  <XTooltip title={god.name}>
                    <img src="/images/gods/jupiter.png" width={50} />
                  </XTooltip>
                </div>
                <div className="content-container" style={{ display: "flex" }}>
                  {god.unitType && unitPrices.length && (
                    <React.Fragment>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        {renderedUnitPrices.slice(0, 2)}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        {renderedUnitPrices.slice(2, 4)}
                      </div>
                    </React.Fragment>
                  )}
                  {god.card && (
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      {god.cardPrice.map((price, index) => {
                        return (
                          <XItemPrice
                            key={index}
                            price={price}
                            iconName={god.card.id}
                            name={god.card.label}
                          />
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
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };
};
