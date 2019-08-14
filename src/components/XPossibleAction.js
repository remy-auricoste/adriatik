module.exports = function(GameActions, SelectionActions, store) {
  return ({ actionType, game, children }) => {
    const handleClick = () => {
      SelectionActions.selectAction(actionType);
    };

    const {
      selection: { actionType: selectedActionType }
    } = store.getState();
    const possibleActionTypes = GameActions.getPossibleActionTypes({ game });
    const canDo = possibleActionTypes.indexOf(actionType) !== -1;
    const isSelectedAction = selectedActionType === actionType;
    return (
      <div
        style={{
          border: canDo ? "solid 1px green" : "none",
          cursor: canDo ? "pointer" : "default",
          borderColor: isSelectedAction ? "yellow" : "green",
          pointerEvents: canDo ? "auto" : "none"
        }}
        onClick={handleClick}
      >
        {children}
      </div>
    );
  };
};
