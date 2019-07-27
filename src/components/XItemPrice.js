module.exports = function(XSesterces, XIcon) {
  return ({ price, iconName, name }) => {
    return (
      <div
        className="XItemPrice"
        style={{
          display: "flex"
        }}
      >
        <XIcon fileName={iconName} size={30} tooltip={name} />
        <XSesterces number={price} />
      </div>
    );
  };
};
