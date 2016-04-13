var Meta = require("../../alias/Meta");

var Building = Meta.declareClass("Building", {
    _primary: "name",
    name: "",
    label: ""
});

module.exports = Building;
