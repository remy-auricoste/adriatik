module.exports = function(RandomReaderAsync) {
  return async () => {
    const index = await RandomReaderAsync.nextInt(0, 5);
    return [0, 1, 1, 2, 2, 3][index];
  };
};
