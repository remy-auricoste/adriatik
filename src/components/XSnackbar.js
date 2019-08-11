module.exports = function(store, MessageActions) {
  return ({}) => {
    const { errorMessage } = store.getState();
    const { display, text } = errorMessage;

    const handleClick = () => {
      MessageActions.resetMessages();
    };
    return (
      <div
        style={{
          position: "absolute",
          top: display ? 5 : -100,
          display: "flex",
          justifyContent: "center",
          transition: "top 0.5s",
          width: "100%"
        }}
      >
        <p
          style={{
            maxWidth: 800,
            backgroundColor: "red",
            border: "solid 1px black",
            borderRadius: 5,
            padding: "0.5em 1em",
            cursor: "pointer"
          }}
          onClick={handleClick}
        >
          {text}
        </p>
      </div>
    );
  };
};
