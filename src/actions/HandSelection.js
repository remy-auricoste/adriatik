module.exports = function(MoveActions, SelectionActions, store) {
  class HandSelection {
    getItemFromAction() {
      const { game } = store.getState();
      const god = game.getCurrentGod();
      const actionType = SelectionActions.getSelectedActionType();
      switch (actionType) {
        case "build":
          return [god.building];
        case "buyUnit":
          return [god.unitType];
      }
      return [];
    }
    getSelectedItems() {
      return MoveActions.getSelectedUnits().concat(this.getItemFromAction());
    }
  }
  const instance = new HandSelection();
  return instance;
};
