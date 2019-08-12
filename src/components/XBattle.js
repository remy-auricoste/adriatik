module.exports = function(XPanel) {
  return ({ game }) => {
    const { battle } = game;
    return (
      <div
        style={{
          position: "absolute",
          display: "flex",
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <div
          style={{
            width: "80%",
            minWidth: 300,
            height: "80%"
          }}
        >
          <XPanel>battle</XPanel>
        </div>
      </div>
    );
  };
};
