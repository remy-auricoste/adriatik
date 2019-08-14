module.exports = function(XPanel) {
  return ({ onClick, children }) => {
    return (
      <p
        onClick={onClick}
        style={{
          padding: "0.5em 1em",
          backgroundColor: "white",
          border: "solid 1px black",
          borderRadius: 5,
          cursor: "pointer"
        }}
      >
        {children}
      </p>
    );
  };
};
