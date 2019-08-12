module.exports = function(XIconCount, store) {
  const getFilename = entity => {
    switch (entity.constructor.name) {
      case "Unit":
        return getFilename(entity.type);
      default:
        return entity.id;
    }
  };
  const getColor = entity => {
    switch (entity.constructor.name) {
      case "Unit":
        const { room } = store.getState();
        const { color } = room.getAccountByPlayerId(entity.ownerId);
        return color;
    }
  };
  return ({ entity }) => {
    return (
      <XIconCount
        fileName={getFilename(entity)}
        color={getColor(entity)}
        value={1}
      />
    );
  };
};
