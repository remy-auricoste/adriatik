const getLibs = () => {
  if (typeof window !== "undefined") {
    return window.libs;
  } else {
    const libNames = [
      "rauricoste-arrays",
      "rauricoste-commandify",
      "rauricoste-logger",
      "rauricoste-request",
      "rauricoste-store-sync",
      "rauricoste-random"
    ];
    const libs = {};
    libNames.forEach(libName => {
      libs[libName] = require(libName);
    });
    return libs;
  }
};

module.exports = getLibs();
