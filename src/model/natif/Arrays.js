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
Array.prototype.addVector = function(array) {
  if (array.length !== this.length) {
    throw new Error("array have length "+array.length+" instead of "+this.length);
  }
  return this.map(function(value, index) {
    return value + array[index];
  });
}
Array.prototype.squares = function() {
  return this.map(function(value) {
    return value * value;
  });
}
Array.prototype.norm = function() {
  return Math.sqrt(this.squares().sum());
}
Array.prototype.mult = function(number) {
  return this.map(function(value) {
    return value * number;
  });
}
Array.prototype.minusVector = function(array) {
  return this.addVector(array.mult(-1));
}
Array.prototype.distance = function(array) {
  return this.minusVector(array).norm();
}
Array.prototype.flatMap = function(fonction) {
  var result = [];
  this.forEach(function(value, index) {
    var array = fonction(value, index);
    result = result.concat(array);
  });
  return result;
}
// cf http://stackoverflow.com/questions/1187518/javascript-array-difference
Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};
Array.prototype.forall = Array.prototype.every;
