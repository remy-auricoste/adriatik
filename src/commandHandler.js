module.exports = function(store, storeCommands, MessageActions) {
  const commandHandler = ({ command }) => {
    return Promise.resolve()
      .then(() => {
        const { game } = store.getState();
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
