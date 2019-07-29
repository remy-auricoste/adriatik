module.exports = function(XTooltip, XOverlay) {
  return ({
    fileName,
    size,
    tooltip = "",
    text = "",
    withOverlay = false,
    overlayProps = {}
  }) => {
    return (
      <XTooltip title={tooltip} display={!!tooltip}>
        <div
          style={{
            width: size,
            height: size
          }}
        >
          <XOverlay {...overlayProps} display={withOverlay}>
            <img
              className="XIcon"
              src={`/images/${fileName}.png`}
              width={size}
              height={size}
            />
          </XOverlay>
          {text && (
            <p
              style={{
                position: "absolute",
                top: 0,
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                pointerEvents: "none"
              }}
            >
              {text}
            </p>
          )}
        </div>
      </XTooltip>
    );
  };
};
