const actions = require("./actions/index");
const components = require("./components/index");
const images = require("./images/index");
const model = require("./model/index");
const services = require("./services/index");
const Injector = require("./Injector");
const commandHandler = require("./commandHandler");
const injects = require("./injects");
const libs = require("./libs");
const main = require("./main");
const tests = require("./tests");
module.exports = {
actions,
components,
images,
model,
services,
Injector,
commandHandler,
injects,
libs,
main,
tests
}