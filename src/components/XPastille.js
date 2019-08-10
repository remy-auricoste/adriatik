module.exports = ({ value = 0, size = 20, display = true, children }) => {
  return (
    <div>
      {children}
      {display && (
        <div
          style={{
            position: "absolute",
            top: -size / 2,
            right: -size / 2,
            borderRadius: "10em",
            border: "solid 1px lightgrey",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "red",
            color: "white",
            width: size,
            height: size,
            fontSize: size * 0.6
          }}
        >
          {value}
        </div>
      )}
    </div>
  );
};
