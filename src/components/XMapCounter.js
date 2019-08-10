module.exports = function(XIcon, XPastille) {
  return ({ fileName, value, color, onClick }) => {
    if (!value) {
      return null;
    }
    const withPastille = value !== 1;
    const isClickable = !!onClick;
    return (
      <div
        className="XMapCounter"
        style={{
          pointerEvents: isClickable ? "auto" : "none",
          cursor: isClickable ? "pointer" : "default"
        }}
        onClick={onClick}
      >
        <XPastille value={value} display={withPastille}>
          <XIcon
            size={30}
            fileName={fileName}
            color={color}
            borderColor={isClickable ? "green" : undefined}
            svgProps={{
              withShadow: true
            }}
          />
        </XPastille>
      </div>
    );
  };
};
