module.exports = function(RandomReaderAsync) {
  class Dice {
    constructor(faces) {
      this.faces = faces;
    }
    roll() {
      const { faces } = this;
      return RandomReaderAsync.nextInt(0, faces.length - 1).then(index => {
        return faces[index];
      });
    }
  }
  const dice = new Dice([0, 1, 1, 2, 2, 3]);
  return () => {
    return dice.roll();
  };
};
