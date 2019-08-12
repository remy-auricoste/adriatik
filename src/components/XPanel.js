module.exports = ({ children, style = {} }) => {
  return (
    <div
      style={Object.assign(
        {
          border: "black solid 1px",
          zIndex: 10,
          backgroundColor: "lightgrey"
        },
        style
      )}
    >
      {children}
    </div>
  );
};
