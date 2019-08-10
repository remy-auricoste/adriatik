const actions = require("./actions/index");
const model = require("./model/index");
const services = require("./services/index");
const Injector = require("./Injector");
const commandHandler = require("./commandHandler");
const injects = require("./injects");
const libs = require("./libs");
const jsDeps = {
	Injector,
	commandHandler,
	injects,
	libs
}

module.exports = Object.assign({}, jsDeps, actions, model, services)