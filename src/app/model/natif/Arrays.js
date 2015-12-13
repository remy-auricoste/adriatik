Array.seq = function(min, max, step) {
  if (!step) {
    step = 1;
  }
  var result = [];
  for (var i=min;i<=max;i+=step) {
    result.push(i);
  }
  return result;
}
Array.prototype.sum = function() {
  var total = 0;
  this.forEach(function(value) {
    total += value;
  });
  return total;
}
Array.prototype.mean = function() {
  return this.sum() / this.length;
}
