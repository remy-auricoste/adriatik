module.exports = function(GameActions, storeCommands, store) {
  const gameActions = new GameActions();
  class StoreActions {
    selectAction(actionType) {
      const {
        selection: { actionType: selectedActionType }
      } = store.getState();
      const isSelectedActionType = selectedActionType === actionType;
      storeCommands.set("selection", {});
      storeCommands.set(
        "selection.actionType",
        isSelectedActionType ? undefined : actionType
      );
    }
    select(entity) {
      const {
        selection: { actionType }
      } = store.getState();
      if (actionType) {
        storeCommands.push("selection.args", entity);
      }
    }
    isSelectionReady({ actionType, args }) {
      if (!actionType) {
        return false;
      }
      const argsTypings = gameActions.getActionCommandTypings()[actionType];
      if (argsTypings.length !== args.length) {
        return false;
      }
    }
  }
  return new StoreActions();
};
