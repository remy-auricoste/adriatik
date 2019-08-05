module.exports = () => {
  const reset = () => {
    localStorage.game = "";
    window.location.reload();
  };
  return (
    <div
      style={{
        position: "fixed",
        bottom: 10,
        left: 10,
        zIndex: 100
      }}
    >
      <input type="button" value="Reset" onClick={reset} />
    </div>
  );
};
