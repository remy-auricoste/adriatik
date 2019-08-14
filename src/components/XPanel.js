module.exports = function(ZIndexs) {
  return ({ children, style = {} }) => {
    return (
      <div
        style={Object.assign(
          {
            border: "black solid 1px",
            zIndex: ZIndexs.panel,
            backgroundColor: "lightgrey"
          },
          style
        )}
      >
        {children}
      </div>
    );
  };
};
