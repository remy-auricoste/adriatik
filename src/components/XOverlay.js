module.exports = ({
  color = "black",
  percentage = 0.3,
  children,
  display = true
}) => {
  return (
    <div>
      {children}
      <div
        style={{
          backgroundColor: color,
          opacity: display ? percentage : 0,
          position: "absolute",
          top: 0,
          width: "100%",
          height: "100%"
        }}
      />
    </div>
  );
};
