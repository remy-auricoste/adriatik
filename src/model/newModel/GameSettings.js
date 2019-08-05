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
    constructor({ gods = normalGods, creatures, warMode = false } = {}) {
      this.gods = gods;
      this.creatures = creatures;
      this.warMode = warMode;
    }
  }
  return GameSettings;
};
