const XIcon = ({ fileName, size }) => {
  return (
    <img
      className="XIcon"
      src={`/images/${fileName}.png`}
      width={size}
      height={size}
    />
  );
};

module.exports = XIcon;
