var gravatarService = require("../services/gravatarService");

module.exports = function(XSesterces, XGodCard, XPanel, store) {
  return ({ game }) => {
    const { players } = game;
    const { room } = store.getState();
    return (
      <div
        style={{
          position: "absolute",
          bottom: 0,
          display: "flex",
          width: "100%",
          justifyContent: "space-evenly"
        }}
      >
        {players.map((player, index) => {
          const account = room.getAccountByPlayerId(player.id);
          const { name, color, email } = account;
          const { gold } = player;
          return (
            <XPanel key={index}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-evenly",
                  backgroundColor: color
                }}
              >
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
                    imageName="priest.png"
                  />
                  <XGodCard
                    count={player.getPhilosophers()}
                    label="philosophe"
                    imageName="philosopher.png"
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
