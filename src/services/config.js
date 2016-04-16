console.log(window.location);

var config = {
  isDev: function() {
    var path = window.location.hash.substring(1);
    return path.startsWith("/dev/");
  }
}

module.exports = config;
