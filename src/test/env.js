env = {
  mode: "prod",
  isTest: function() {
    return this.mode === "test";
  },
  isDev: function() {
    return this.mode === "dev";
  },
  isProd: function() {
    return this.mode === "prod";
  }
}

module.exports = env;
