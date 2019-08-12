module.exports = function(GameActions, storeCommands, store, commandHandler) {
  const gameActions = new GameActions();
  storeCommands.set("selection", { args: [] });

  class SelectionActions {
    reset() {
      storeCommands.set("selection", { args: [] });
    }
    selectAction(actionType) {
      const { actionType: selectedActionType } = this.getState();
      const isSelectedActionType = selectedActionType === actionType;
      const newActionType = isSelectedActionType ? undefined : actionType;
      this.reset();
      storeCommands.set("selection.actionType", newActionType);
      this.checkSelection();
      if (actionType === "pass") {
        this.reset();
      }
    }
    select(entity) {
      const { actionType } = this.getState();
      if (actionType) {
        storeCommands.push("selection.args", entity);
      }
      this.checkSelection();
    }
    checkSelection() {
      const selection = this.getState();
      if (this.isSelectionReady(selection)) {
        const { actionType, args = [] } = selection;
        const argsTypings = gameActions.getActionCommandTypings()[actionType];
        const params = {};
        argsTypings.forEach((typing, index) => {
          const paramName = typing.toLowerCase() + "Id";
          params[paramName] = args[index].id;
        });
        const command = gameActions.commands()[actionType](params);
        if (!args.length) {
          this.reset();
        } else {
          storeCommands.set("selection.args", []);
        }
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
    getState() {
      const { selection } = store.getState();
      return selection;
    }
    getSelectedActionType() {
      const { actionType } = this.getState();
      return actionType;
    }
  }
  return new SelectionActions();
};
