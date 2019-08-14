const { useEffect, useState } = React;

module.exports = function(HandSelection, XEntity, ZIndexs) {
  return () => {
    const [{ x, y }, setMousePos] = useState({ x: 0, y: 0 });
    useEffect(() => {
      const listener = event => {
        setMousePos({
          x: event.clientX,
          y: event.clientY
        });
      };
      window.addEventListener("mousemove", listener);
      return () => {
        window.removeEventListener("mousemove", listener);
      };
    }, []);

    const items = HandSelection.getSelectedItems();
    return (
      <div
        style={{
          position: "absolute",
          top: y + 20,
          left: x + 10,
          zIndex: ZIndexs.mouse,
          display: "flex"
        }}
      >
        {items.map((item, index) => {
          return <XEntity entity={item} key={index} />;
        })}
      </div>
    );
  };
};
