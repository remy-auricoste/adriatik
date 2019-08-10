module.exports = function(store, storeCommands) {
  const commandHandler = ({ command }) => {
    return Promise.resolve()
      .then(() => {
        const { game } = store.getState();
        return command.apply(game);
      })
      .then(game => {
        storeCommands.set("game", game);
        localStorage.game = JSON.stringify(game);
      });
  };
  return commandHandler;
};
