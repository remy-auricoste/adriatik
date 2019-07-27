module.exports = ({ children, style = {} }) => {
  return (
    <div
      style={Object.assign(
        {
          border: "black solid 1px",
          borderBottom: "none"
        },
        style
      )}
    >
      {children}
    </div>
  );
};
