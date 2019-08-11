module.exports = ({
  path,
  size,
  color,
  backgroundColor = "white",
  withShadow = false,
  shadowOffset = 20,
  children
}) => {
  return (
    <svg viewBox="0 0 512 512" style={{ width: size, height: size }}>
      {withShadow && (
        <defs>
          <filter id="shadow-1" height="300%" width="300%" x="-100%" y="-100%">
            <feFlood floor-color="black" result="flood" />
            <feComposite
              in="flood"
              in2="SourceGraphic"
              operator="atop"
              result="composite"
            />
            0<feOffset result="offset" dy={shadowOffset} />
            <feComposite in="SourceGraphic" in2="offset" operator="over" />
          </filter>
        </defs>
      )}
      <circle cx="256" cy="256" r="256" fill={backgroundColor} />
      <g>
        {path && (
          <path
            d={path}
            fill={color}
            filter={withShadow ? "url(#shadow-1)" : undefined}
          />
        )}
        {children}
      </g>
    </svg>
  );
};
