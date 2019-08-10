module.exports = function(GameActions, StoreActions, store) {
  const gameActions = new GameActions();
  return ({ actionType, game, children }) => {
    const handleClick = () => {
      StoreActions.selectAction(actionType);
    };

    const {
      selection: { actionType: selectedActionType }
    } = store.getState();
    const possibleActionTypes = gameActions.getPossibleActionTypes({ game });
    const canDo = possibleActionTypes.indexOf(actionType) !== -1;
    const isSelectedAction = selectedActionType === actionType;
    return (
      <div
        style={{
          border: canDo ? "solid 1px green" : "none",
          cursor: canDo ? "pointer" : "default",
          borderColor: isSelectedAction ? "yellow" : "green"
        }}
        onClick={handleClick}
      >
        {children}
      </div>
    );
  };
};
