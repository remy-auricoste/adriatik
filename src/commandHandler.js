module.exports = function(store, storeCommands, MessageActions, GameActions) {
  const commandHandler = ({ command }) => {
    const { game } = store.getState();
    const actionType = command.method;
    if (!GameActions.canDo({ game, actionType })) {
      throw new Error(
        `commandHandler : actionType=${actionType} is not authorized`
      );
    }

    return Promise.resolve()
      .then(() => {
        return command.apply(game);
      })
      .then(game => {
        storeCommands.set("game", game);
        localStorage.game = JSON.stringify(game);
      })
      .catch(err => {
        console.error(err);
        MessageActions.setErrorMessage(err.message);
      });
  };
  return commandHandler;
};
