module.exports = function(
  XPlayerPanel,
  XBidPanel,
  XMap,
  XReset,
  store,
  XSnackbar,
  XCurrentSelection
) {
  return ({ game }) => {
    const { room } = store.getState();
    return (
      <div
        className="XRoot"
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundImage: "url('/images/map.jpg')"
        }}
      >
        <div
          className="left"
          style={{
            height: "100%",
            minWidth: 200
          }}
        >
          <XBidPanel game={game} room={room} />
        </div>
        <div
          className="right"
          style={{
            flex: 1
          }}
        >
          <XMap game={game} />
          <XPlayerPanel game={game} room={room} />
          <XReset />
        </div>
        <XSnackbar />
        <XCurrentSelection />
      </div>
    );
  };
};
