module.exports = {
  isDev: function() {
    var path = location.pathname;
    return path.startsWith("/dev/");
  }
}
