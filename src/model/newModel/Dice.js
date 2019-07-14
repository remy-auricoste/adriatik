module.exports = function(randomReaderAsync) {
  return async () => {
    const index = await randomReaderAsync.nextInt(0, 5);
    return [0, 1, 1, 2, 2, 3][index];
  };
};
