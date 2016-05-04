var Meta = require("../../alias/Meta");

var Command = Meta.createClass("Command", {
    type: "CommandType",
    player: "Player",
    args: [],
    callback: "fct",
    init: function() {
      if (!this.args) {
        this.args = [];
      }
    }
});

module.exports = Command;
