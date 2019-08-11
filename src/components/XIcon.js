module.exports = function(
  XTooltip,
  XOverlay,
  SvgTrieme,
  SvgSpartanHelmet,
  SvgDuration,
  SvgCornucopia,
  SvgBooks,
  SvgTemple,
  SvgPrayer,
  SvgRoman,
  SvgPort,
  SvgTower
) {
  const svgMapping = {
    ship: SvgTrieme,
    legionnaire: SvgSpartanHelmet,
    duration: SvgDuration,
    cornucopia: SvgCornucopia,
    university: SvgBooks,
    temple: SvgTemple,
    priest: SvgPrayer,
    philosopher: SvgRoman,
    port: SvgPort,
    fort: SvgTower
  };
  return ({
    fileName,
    size,
    tooltip = "",
    text = "",
    withOverlay = false,
    overlayProps = {},
    textProps = {},
    color = "black",
    svgProps = {},
    borderColor
  }) => {
    const mappedSvg = svgMapping[fileName];
    const borderWidth = borderColor ? 2 : 0;
    return (
      <XTooltip title={tooltip} display={!!tooltip}>
        <div
          style={{
            width: size + borderWidth * 2,
            height: size + borderWidth * 2,
            borderRadius: "10em",
            borderStyle: "solid",
            borderWidth,
            borderColor
          }}
        >
          <XOverlay {...overlayProps} display={withOverlay}>
            {!mappedSvg && (
              <img
                className="XIcon"
                src={`/images/${fileName}.png`}
                width={size}
                height={size}
              />
            )}
            {mappedSvg &&
              React.createElement(
                mappedSvg,
                Object.assign({}, svgProps, { size, color })
              )}
          </XOverlay>
          {text && (
            <p
              style={Object.assign(
                {},
                {
                  position: "absolute",
                  top: 0,
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  pointerEvents: "none"
                },
                textProps
              )}
            >
              {text}
            </p>
          )}
        </div>
      </XTooltip>
    );
  };
};
