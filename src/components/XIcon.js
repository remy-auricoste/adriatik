module.exports = function(
  XTooltip,
  XOverlay,
  SvgTrieme,
  SvgSpartanHelmet,
  SvgDuration,
  SvgCornucopia
) {
  console.log(SvgCornucopia);
  const svgMapping = {
    ship: SvgTrieme,
    legionnaire: SvgSpartanHelmet,
    duration: SvgDuration,
    cornucopia: SvgCornucopia
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
    svgProps = {}
  }) => {
    const mappedSvg = svgMapping[fileName];
    return (
      <XTooltip title={tooltip} display={!!tooltip}>
        <div
          style={{
            width: size,
            height: size
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
