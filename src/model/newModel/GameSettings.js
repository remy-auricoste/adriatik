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
    constructor({
      players,
      gods = normalGods,
      creatures,
      colors,
      warMode = false
    } = {}) {
      this.players = players;
      this.gods = gods;
      this.creatures = creatures;
      this.colors = colors;
      this.warMode = warMode;
    }
  }
  return GameSettings;
};
