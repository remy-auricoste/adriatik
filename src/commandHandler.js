module.exports = function(store, storeCommands) {
  const commandHandler = ({ command }) => {
    let { game } = store.getState();
    game = command.apply(game);
    if (game.constructor !== Promise) {
      game = Promise.resolve(game);
    }
    game.then(game => {
      storeCommands.set("game", game);
      localStorage.game = JSON.stringify(game);
    });
  };
  return commandHandler;
};
