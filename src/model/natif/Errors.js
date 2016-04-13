Error.prototype.prefix = function(prefix) {
  this.message = prefix + this.message;
  return this;
}
