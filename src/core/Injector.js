var Injector = function() {
  this.dependencies = {};
}
Injector.prototype.register = function(key, value) {
  this.dependencies[key] = value;
}
Injector.prototype.resolve = function(deps, fonction, scope) {
  var args = [];
  for(var i=0; i<deps.length, d=deps[i]; i++) {
    var value = this.dependencies[d];
    if(value) {
        args.push(value);
    } else {
        throw new Error('Can\'t resolve ' + d);
    }
  }
  var appliedSelf = scope || {};
  return fonction.apply(appliedSelf, args);
}

module.exports = Injector;
