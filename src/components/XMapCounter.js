module.exports = function(XIcon, XPastille) {
  return ({ fileName, value, color }) => {
    if (!value) {
      return null;
    }
    const withPastille = value !== 1;
    return (
      <div
        className="XMapCounter"
        style={{
          pointerEvents: "unset"
        }}
      >
        <XPastille value={value} display={withPastille}>
          <XIcon
            size={30}
            fileName={fileName}
            color={color}
            svgProps={{
              withShadow: true
            }}
          />
        </XPastille>
      </div>
    );
  };
};
