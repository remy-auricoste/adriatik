module.exports = ({ title, display = true, children }) => {
  if (!display) {
    return children;
  }
  return (
    <div>
      <div>{title}</div>
      {children}
    </div>
  );
};
