module.exports = function(GameActions) {
  const gameActions = new GameActions();
  return ({ actionType, game, children }) => {
    const possibleActionTypes = gameActions.getPossibleActionTypes({ game });
    const canDo = possibleActionTypes.indexOf(actionType) !== -1;
    return (
      <div
        style={{
          border: canDo ? "solid 1px green" : "none"
        }}
      >
        {children}
      </div>
    );
  };
};
