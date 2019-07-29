module.exports = function(XIcon) {
  return ({ fileName, value }) => {
    return (
      <div
        className="XMapCounter"
        style={{
          display: value ? "block" : "none",
          pointerEvents: "unset"
        }}
      >
        <XIcon size={30} fileName={fileName} text={value} />
      </div>
    );
  };
};
