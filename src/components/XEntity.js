module.exports = function(XIconCount, store, XIcon) {
  const getColor = entity => {
    const { room } = store.getState();
    const { color } = room.getAccountByPlayerId(entity.ownerId);
    return color;
  };
  const renderEntity = entity => {
    const iconSize = 30;
    switch (entity.constructor.name) {
      case "Building":
        return <XIcon fileName={entity.id} size={iconSize} shape="square" />;
      case "UnitType":
        return <XIconCount fileName={entity.id} size={iconSize} value={1} />;
      case "Unit":
        return (
          <XIconCount
            fileName={entity.type.id}
            size={iconSize}
            color={getColor(entity)}
            value={1}
          />
        );
    }
    return null;
  };

  return ({ entity }) => {
    return renderEntity(entity);
  };
};
