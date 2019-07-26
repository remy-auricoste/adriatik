module.exports = function(XTooltip, Arrays) {
  return ({ count, label, imageName }) => {
    return (
      <XTooltip title={`${count} ${label}(s)`}>
        <div>
          {Arrays.seq(0, count).map(i => {
            return <img key={i} src={`/images/${imageName}`} />;
          })}
        </div>
      </XTooltip>
    );
  };
};
