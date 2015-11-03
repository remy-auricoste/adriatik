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
