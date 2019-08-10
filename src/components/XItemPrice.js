module.exports = function(XSesterces, XIcon) {
  return ({ price, iconName, name, buyable = true }) => {
    return (
      <div
        className="XItemPrice"
        style={{
          display: "flex"
        }}
      >
        <XIcon
          fileName={iconName}
          size={30}
          tooltip={name}
          withOverlay={!buyable}
        />
        <XSesterces number={price} />
      </div>
    );
  };
};
