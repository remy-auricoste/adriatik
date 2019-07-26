module.exports = function(XPlayerPanel) {
  return ({ game }) => {
    return (
      <div
        className="XRoot"
        style={{
          width: "100%",
          height: "100%"
        }}
      >
        <XPlayerPanel game={game} />
      </div>
    );
  };
};
