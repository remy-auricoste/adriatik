module.exports = ({ children, style = {} }) => {
  return (
    <div
      style={Object.assign(
        {
          border: "black solid 1px",
          borderBottom: "none",
          zIndex: 10
        },
        style
      )}
    >
      {children}
    </div>
  );
};
