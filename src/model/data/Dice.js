var RandomWrapper = require("../tools/RandomWrapper");

var Dice = function (randomValue) {
    var wrapper = new RandomWrapper({value: randomValue});
    var index = wrapper.nextInt(0, 5);
    return [0, 1, 1, 2, 2, 3][index];
}

module.exports = Dice;
