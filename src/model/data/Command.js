var Meta = require("../../alias/Meta");

var Command = Meta.createClass("Command", {
    type: "CommandType",
    player: "Player",
    args: [],
    callback: "fct"
});

module.exports = Command;
