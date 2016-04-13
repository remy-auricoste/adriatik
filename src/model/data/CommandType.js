var Meta = require("../../alias/Meta");

var CommandType = Meta.createClass("CommandType", {
    _primary: "name",
    name: "",
    methodName: "",
    argCount: 1
});

module.exports = CommandType;
