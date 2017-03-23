var Injector = function() {
  this.dependencies = {};
  this.solved = {};
}
Injector.prototype.register = function(key, deps, value) {
  if (value === undefined) {
    value = deps;
    return this.register(key, [], function() {
      return value;
    })
  }
  this.dependencies[key] = {
    deps: deps,
    value: value
  };
}
Injector.prototype.buildInstance = function(name) {
  var def = this.dependencies[name];
  if (def === undefined) {
    throw new Error("could not resolve "+name);
  }
  if (!def.deps.length) {
    return def.value();
  }
  var args = [];
  for(var i=0; i<def.deps.length, depName=def.deps[i]; i++) {
    args.push(this.getInstance(depName));
  }
  return def.value.apply({}, args);
}
Injector.prototype.getInstance = function(name) {
  var solved = this.solved[name];
  if (solved !== undefined) {
    return solved;
  }
  var built = this.buildInstance(name);
  this.solved[name] = built;
  return built;
}

module.exports = Injector;
