const coinSize = 35;

module.exports = function(
  XTooltip,
  God,
  PhaseBid,
  GameActions,
  Arrays,
  XItemPrice,
  XSesterces,
  XPossibleAction,
  XPlayerIcon,
  commandHandler,
  XIcon,
  SvgDuration
) {
  const gameActions = new GameActions();
  const commands = gameActions.commands();
  const { Ceres } = God;
  return ({ game, room }) => {
    const handleBid = (god, amount) => {
      const isCeres = god.id === Ceres.id;
      amount = isCeres ? 0 : amount;
      const command = commands.placeBid({ godId: god.id, amount });
      commandHandler({ command });
    };

    const { gods, bidState } = game;
    const player = game.getCurrentPlayer();
    const currentGod = game.getCurrentGod();
    const phase = game.getCurrentPhase();
    const isPhaseBid = phase.constructor === PhaseBid;
    return (
      <div className="XBidPanel" style={{ width: 400 }}>
        {gods.map(god => {
          const bid = bidState.getBidsForGod(god)[0];
          const isCeres = god.id === Ceres.id;
          const bidGoldCount = (bid && bid.amount) || 0;
          const maxPossibleBid = isCeres ? 1 : player.getMaxBid();
          const unitPrices = god.getUnitPrices();
          const isCurrentGod = currentGod && god.id === currentGod.id;
          const { color } = room.getAccountByPlayerId(player.id);

          const renderedUnitPrices = unitPrices.map((price, index) => {
            const { unitBuyCount } = god;
            const isBought = unitBuyCount > index;
            return (
              <XItemPrice
                key={index}
                price={price}
                iconName={god.unitType.id}
                name={god.unitType.label}
                buyable={!isBought}
              />
            );
          });

          return (
            <div
              key={god.id}
              style={{
                display: "flex",
                flexDirection: "column",
                border: isCurrentGod ? "solid 3px green" : "solid 1px black",
                marginTop: 10,
                marginLeft: 10,
                marginRight: 10
              }}
            >
              <div className="gold-container" style={{ display: "flex" }}>
                {isPhaseBid &&
                  Arrays.seq(0, Math.max(maxPossibleBid, bidGoldCount)).map(
                    index => {
                      const gold = index + 1;
                      const isPossibleBid = gold > bidGoldCount;
                      const isCurrentBid = gold === bidGoldCount;
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
                              backgroundColor: isCurrentBid
                                ? color
                                : "transparent",
                              borderRadius: "10em",
                              border: isCurrentBid ? "solid 1px black" : "none",
                              width: coinSize,
                              height: coinSize,
                              cursor: isPossibleBid ? "pointer" : "default"
                            }}
                            onClick={() => {
                              isPossibleBid && handleBid(god, gold);
                            }}
                          >
                            {!isCurrentBid && (
                              <XIcon
                                fileName="sesterce"
                                withOverlay={!isPossibleBid}
                                size={coinSize}
                                text={isPossibleBid ? "" : gold}
                                overlayProps={{
                                  color: "white",
                                  percentage: 0.6
                                }}
                              />
                            )}
                          </div>
                        </XTooltip>
                      );
                    }
                  )}
                {!isPhaseBid && bid && (
                  <div style={{ display: "flex" }}>
                    <XPlayerIcon playerId={bid.playerId} />
                    <XSesterces number={bid.amount} />
                  </div>
                )}
              </div>
              <div
                className="row-margin"
                style={{ display: "flex", alignItems: "center" }}
              >
                <XTooltip title={god.name}>
                  <img src="/images/gods/jupiter.png" width={50} />
                </XTooltip>
                {(god.unitType && unitPrices.length && (
                  <XPossibleAction actionType="buyUnit" game={game}>
                    <div style={{ display: "flex" }}>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        {renderedUnitPrices.slice(0, 2)}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        {renderedUnitPrices.slice(2, 4)}
                      </div>
                    </div>
                  </XPossibleAction>
                )) ||
                  null}
                {god.card && (
                  <XPossibleAction actionType="buyGodCard" game={game}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      {god.cardPrice.map((price, index) => {
                        const { cardBuyCount } = god;
                        const isBought = cardBuyCount > index;
                        return (
                          <XItemPrice
                            key={index}
                            price={price}
                            iconName={god.card.id}
                            name={god.card.label}
                            buyable={!isBought}
                          />
                        );
                      })}
                    </div>
                  </XPossibleAction>
                )}
                {god.building && (
                  <XPossibleAction actionType="build" game={game}>
                    <XItemPrice
                      price={2}
                      iconName={god.building.id}
                      name={god.building.label}
                    />
                  </XPossibleAction>
                )}
                {!isPhaseBid && isCurrentGod && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: 10,
                      right: 10
                    }}
                  >
                    <XPossibleAction actionType="pass" game={game}>
                      <XIcon
                        size={30}
                        fileName="duration"
                        color="#18b100"
                        svgProps={{
                          withShadow: true
                        }}
                      />
                    </XPossibleAction>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };
};
