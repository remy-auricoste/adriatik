var ModelBuilder = require("rauricoste-model");

var classBuilder = function(template) {
  if (arguments.length === 2) {
    template = arguments[1];
  }
  var clazz = ModelBuilder.build(template);
  if (template._primary) {
    clazz = clazz.extends({
      _init: function() {
        clazz._all[this[template._primary]] = this;
      }
    })
    clazz._all = {};
  }
  return clazz;
}

module.exports = {
  createClass: classBuilder,
  declareClass: classBuilder,
  build: classBuilder,
  requireType: function(value, expectedType) {
    var type = typeof value;
    if (type !== expectedType) {
      throw new Error("expected type "+expectedType+". got "+type);
    }
  }
};
