module.exports = function(God) {
  const normalGods = [
    God.Jupiter,
    God.Neptune,
    God.Junon,
    God.Minerve,
    God.Ceres
  ];
  const warModeGods = normalGods.concat([God.Pluton]);

  class GameSettings {
    constructor({ gods = normalGods, warMode = false } = {}) {
      this.gods = gods.map(_ => new God(_));
      this.warMode = warMode;
    }
  }
  return GameSettings;
};
