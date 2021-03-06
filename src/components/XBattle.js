const { useState } = React;

module.exports = function(
  XPanel,
  XEntity,
  UnitType,
  Unit,
  XButton,
  GameActions,
  BattleDecisions,
  commandHandler,
  TerritoryType
) {
  const { stay, retreat } = BattleDecisions;
  const commands = GameActions.commands();
  const { Ship, Legionnaire } = UnitType;
  const { sea, earth } = TerritoryType;
  const getUnitType = territoryType => {
    return territoryType === sea ? Ship : Legionnaire;
  };

  return ({ game }) => {
    const [lastClosedBattle, setLastClosedBattle] = useState(null);

    const { battle: battleFsm } = game;
    if (!battleFsm) {
      return null;
    }

    const handleDecision = (playerId, decision) => () => {
      console.log("decision", decision);
      const player = game.getEntityById(playerId);
      switch (decision) {
        case stay:
          const command = commands.stay({ game, player });
          commandHandler({ command });
      }
    };

    const { state: battle } = battleFsm;
    const { states, territory } = battle;
    const isBattleOver = battleFsm.isDone();
    const shouldDisplayBattle = !isBattleOver || lastClosedBattle !== battle.id;
    if (!shouldDisplayBattle) {
      return null;
    }
    console.log("battleFsm", battleFsm);
    return (
      <div
        style={{
          position: "absolute",
          display: "flex",
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <div
          style={{
            width: "80%",
            minWidth: 300,
            height: "80%"
          }}
        >
          <XPanel>
            {isBattleOver && (
              <div
                style={{
                  position: "absolute",
                  bottom: 10,
                  right: 10
                }}
              >
                <XButton onClick={() => setLastClosedBattle(battle.id)}>
                  Fermer
                </XButton>
              </div>
            )}
            <div
              style={{
                display: "flex",
                justifyContent: "space-evenly"
              }}
            >
              {states.map((battleState, index) => {
                const {
                  score,
                  strength,
                  loss,
                  resolvedLoss,
                  decision,
                  playerId
                } = battleState;
                const isDefender = battle.isDefender(playerId);
                const role = isDefender ? "defender" : "attacker";
                const isWaitingDecision =
                  battleFsm.currentSteps.indexOf(`make decision ${role}`) !==
                  -1;
                const dice = score - strength;
                const units = territory.getUnits(game.getEntityById(playerId));
                let defendingBuildings = [];
                if (isDefender) {
                  defendingBuildings = battle.getDefendingBuildings();
                }

                return (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center"
                    }}
                  >
                    <div style={{ display: "flex" }}>
                      {defendingBuildings.map((building, buildingIndex) => {
                        return (
                          <XEntity key={buildingIndex} entity={building} />
                        );
                      })}
                      {units.map((unit, unitIndex) => {
                        return <XEntity key={unitIndex} entity={unit} />;
                      })}
                      {resolvedLoss !== 0 && (
                        <div style={{ border: "solid 1px red" }}>
                          <XEntity
                            entity={
                              new Unit({
                                ownerId: playerId,
                                type: getUnitType(territory.type)
                              })
                            }
                          />
                        </div>
                      )}
                    </div>
                    <div>
                      {dice > 0 && (
                        <img src={`/images/dice/dice_${dice}.png`} />
                      )}
                      {dice === 0 && (
                        <div
                          style={{
                            width: 20,
                            height: 20,
                            backgroundColor: "white"
                          }}
                        />
                      )}
                    </div>
                    {isWaitingDecision && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-evenly"
                        }}
                      >
                        <XButton onClick={handleDecision(playerId, stay)}>
                          Combattre
                        </XButton>
                        <XButton onClick={handleDecision(playerId, retreat)}>
                          Battre en retraite
                        </XButton>
                      </div>
                    )}
                    <p>strength : {strength}</p>
                    <p>dice : {dice}</p>
                    <p>score : {score}</p>
                    <p>loose ? : {!!loss + ""}</p>
                    <p>resolvedLoss : {resolvedLoss}</p>
                    <p>decision : {decision}</p>
                  </div>
                );
              })}
            </div>
          </XPanel>
        </div>
      </div>
    );
  };
};
