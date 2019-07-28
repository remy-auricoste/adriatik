module.exports = function(XPlayerPanel, XBidPanel, XMap) {
  return ({ game }) => {
    return (
      <div
        className="XRoot"
        style={{
          width: "100%",
          height: "100%",
          display: "flex"
        }}
      >
        <div
          className="left"
          style={{
            height: "100%",
            minWidth: 200,
            borderRight: "black solid 1px"
          }}
        >
          <XBidPanel game={game} />
        </div>
        <div
          className="right"
          style={{
            flex: 1
          }}
        >
          <XMap game={game} />
          <XPlayerPanel game={game} />
        </div>
      </div>
    );
  };
};
