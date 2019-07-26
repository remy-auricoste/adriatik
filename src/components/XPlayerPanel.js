var gravatarService = require("../services/gravatarService");

module.exports = function(XSesterces, XGodCard, XPanel) {
  return ({ game }) => {
    const { players } = game;
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
          return (
            <XPanel key={index}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-evenly"
                }}
              >
                <div>{player.name}</div>
                {player.account && player.account.email && (
                  <div className="player-avatar">
                    <img
                      src={gravatarService.getPictureUrl(player.account.email)}
                    />
                  </div>
                )}
                <XSesterces number={player.gold} size={30} stacked={true} />
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
