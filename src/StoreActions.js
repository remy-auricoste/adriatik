module.exports = function(GameActions, storeCommands, store, commandHandler) {
  const gameActions = new GameActions();
  class StoreActions {
    resetSelection() {
      storeCommands.set("selection", {});
    }
    selectAction(actionType) {
      const {
        selection: { actionType: selectedActionType }
      } = store.getState();
      const isSelectedActionType = selectedActionType === actionType;
      this.resetSelection();
      storeCommands.set(
        "selection.actionType",
        isSelectedActionType ? undefined : actionType
      );
      this.checkSelection();
    }
    select(entity) {
      const {
        selection: { actionType }
      } = store.getState();
      if (actionType) {
        storeCommands.push("selection.args", entity);
      }
      this.checkSelection();
    }
    checkSelection() {
      const { selection } = store.getState();
      if (this.isSelectionReady(selection)) {
        const { actionType, args = [] } = selection;
        const argsTypings = gameActions.getActionCommandTypings()[actionType];
        const params = {};
        argsTypings.forEach((typing, index) => {
          const paramName = typing.toLowerCase() + "Id";
          params[paramName] = args[index].id;
        });
        const command = gameActions.commands()[actionType](params);
        storeCommands.set("selection.args", []);
        commandHandler({ command });
      }
    }
    isSelectionReady(selection) {
      if (!selection) {
        return false;
      }
      const { actionType, args = [] } = selection;
      if (!actionType) {
        return false;
      }
      const argsTypings = gameActions.getActionCommandTypings()[actionType];
      if (args.length !== argsTypings.length) {
        return false;
      }
      const areAllTypesOk = argsTypings.every(
        (typing, index) => typing === args[index].constructor.name
      );
      return areAllTypesOk;
    }
  }
  return new StoreActions();
};
