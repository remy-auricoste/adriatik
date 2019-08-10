const natif = require("./natif/index");
const newModel = require("./newModel/index");
const room = require("./room/index");
const tools = require("./tools/index");
const jsDeps = {

}

module.exports = Object.assign({}, jsDeps, natif, newModel, room, tools)