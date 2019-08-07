module.exports = function(store) {
  return ({ playerId, size = 30 }) => {
    const { room } = store.getState();
    const { color } = room.getAccountByPlayerId(playerId);
    return (
      <div
        style={{
          backgroundColor: color,
          width: size,
          height: size,
          borderRadius: "30em"
        }}
      />
    );
  };
};
