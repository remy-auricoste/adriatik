module.exports = function(XTooltip, Arrays, XIcon) {
  return ({ count, label, imageName }) => {
    return (
      <XTooltip title={`${count} ${label}(s)`}>
        <div style={{ display: "flex" }}>
          {Arrays.seq(0, count).map(i => {
            return <XIcon key={i} fileName={imageName} size={30} />;
          })}
        </div>
      </XTooltip>
    );
  };
};
