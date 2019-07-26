module.exports = function(XIcon, XTooltip, Arrays) {
  return ({ number, stacked = true, size = 30, withTooltip = true }) => {
    if (number > 0) {
      return (
        <XTooltip title={`${number} sesterce(s)`} display={withTooltip}>
          <div
            style={{
              display: "flex"
            }}
          >
            {Arrays.seq(0, number).map(i => {
              return (
                <div
                  key={i}
                  style={{
                    marginLeft: stacked && !!i ? (-1 * size) / 2 : 0
                  }}
                >
                  <XIcon fileName="sesterce" size={size} />
                </div>
              );
            })}
          </div>
        </XTooltip>
      );
    } else {
      return (
        <div className="zero-container">
          <XIcon fileName="sesterce" size={size} />
          <div className="zero">0</div>
        </div>
      );
    }
  };
};
