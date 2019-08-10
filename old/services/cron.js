module.exports = function(fonction, interval) {
  function call() {
    window.setTimeout(function() {
      fonction();
      call();
    }, interval);
  }
  call();
}


