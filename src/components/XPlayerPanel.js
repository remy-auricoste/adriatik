var gravatarService = require("../services/gravatarService");

module.exports = function(XSesterces, XGodCard, XPanel, XPlayerIcon) {
  return ({ game, room }) => {
    const { players } = game;
    return (
      <div
        style={{
          position: "absolute",
          bottom: 0,
          display: "flex",
          width: "100%",
          justifyContent: "space-evenly",
          alignItems: "flex-end",
          pointerEvents: "none"
        }}
      >
        {players.map((player, index) => {
          const account = room.getAccountByPlayerId(player.id);
          const { name, email } = account;
          const { gold } = player;
          return (
            <XPanel key={index} style={{ borderBottom: "none" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-evenly",
                  pointerEvents: "auto"
                }}
              >
                <XPlayerIcon playerId={player.id} />
                <p>{name}</p>
                {email && (
                  <div className="player-avatar">
                    <img src={gravatarService.getPictureUrl(email)} />
                  </div>
                )}
                <XSesterces number={gold} size={30} stacked={true} />
                <div className="resources">
                  <XGodCard
                    count={player.getPriests()}
                    label="prêtre"
                    imageName="priest"
                  />
                  <XGodCard
                    count={player.getPhilosophers()}
                    label="philosophe"
                    imageName="philosopher"
                  />
                </div>
              </div>
            </XPanel>
          );
        })}
      </div>
    );
  };
};
