module.exports = {
  keys: ["email"],
  getData: function() {
    var account = {};
    this.keys.map(function(key) {
      account[key] = window.localStorage["account."+key];
    });
    if (!account.name) {
      account.name = "random"+Math.random();
    }
    if (!account.email || !account.email.length) {
      throw new Error("Veuillez renseigner votre email sur la page /#/account");
    }
    return account;
  },
  save: function(account) {
    this.keys.map(function(key) {
      var value = account[key];
      window.localStorage["account."+key] = value;
    });
  }
}


