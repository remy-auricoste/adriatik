const { useState, useRef } = React;
const ReactDOM = window.ReactDOM;

const tooltipElement = document.createElement("div");
tooltipElement.id = "XTooltip";
Object.assign(tooltipElement.style, {
  position: "absolute",
  top: 0,
  left: 0,
  pointerEvents: "none"
});
document.body.appendChild(tooltipElement);

const padding = 0.5;
const margin = 1;

const getPlacementStyles = placement => {
  const space = padding * 2 + margin + 1;
  switch (placement) {
    case "top":
      return {
        parent: {
          top: 0,
          width: "100%"
        },
        child: { top: -1 * space + "em" }
      };
    case "bottom":
      return {
        parent: {
          bottom: 0,
          width: "100%"
        },
        child: { bottom: -1 * space + "em" }
      };
    case "left":
      return {
        parent: {
          flexDirection: "column",
          height: "100%",
          left: 0
        },
        child: { left: "-110%" }
      };
    case "right":
      return {
        parent: {
          flexDirection: "column",
          height: "100%",
          right: 0
        },
        child: { right: "-110%" }
      };
    default:
      throw new Error(`unsupported placement ${placement}`);
  }
};

let firstRender = true;
const TooltipElement = ({
  title,
  display,
  parent,
  placement,
  debug = false
}) => {
  if (display) {
    firstRender = false;
  }
  if (firstRender || !parent) {
    return null;
  }
  const { top, left, width, height } = parent.getBoundingClientRect();
  const { parent: parentStyle, child: childStyle } = getPlacementStyles(
    placement
  );
  return (
    <div
      style={{
        position: "absolute",
        top: top + window.scrollY,
        left,
        width,
        height,
        zIndex: 10,
        opacity: display || debug ? 0.9 : 0,
        transition: "opacity 0.2s",
        pointerEvents: "none",
        display: firstRender ? "none" : "block"
      }}
    >
      <div
        style={Object.assign(
          {
            position: "absolute",
            display: "flex",
            justifyContent: "center",
            pointerEvents: "none",
            width: 300
          },
          parentStyle
        )}
      >
        <div
          style={Object.assign(
            {
              backgroundColor: "grey",
              padding: `${padding}em ${1 + padding}em`,
              borderRadius: 3,
              fontSize: 14,
              pointerEvents: "none"
            },
            childStyle
          )}
        >
          {title}
        </div>
      </div>
    </div>
  );
};

module.exports = ({ title, display = true, children, placement = "top" }) => {
  const [isOver, setOver] = useState(false);
  const ref = useRef(null);

  setTimeout(() => {
    ReactDOM.render(
      <TooltipElement
        title={title}
        display={isOver && display}
        parent={ref.current}
        placement={placement}
      />,
      tooltipElement
    );
  });

  if (!display) {
    return children;
  }
  return (
    <div
      ref={ref}
      onMouseOver={() => setOver(true)}
      onMouseOut={() => setOver(false)}
    >
      {children}
    </div>
  );
};
