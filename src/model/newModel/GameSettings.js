module.exports = class GameSettings {
  constructor({ players, gods = [], creatures, colors, warMode = true } = {}) {
    Object.assign(this, arguments[0]);
  }
};
